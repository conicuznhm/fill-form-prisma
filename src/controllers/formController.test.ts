import {Request, Response} from 'express';
import {createFormSubmission} from './formController';
import {prismaTestClient} from '../config/test-db';

// Mock the Prisma client
jest.mock('../config/test-db', () => ({
    _esModule: true,
    default: prismaTestClient
}));

describe('Form Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject = {};
    
    beforeEach(() => {
        mockRequest = {};
        responseObject = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation(result => {
                responseObject = result;
                return mockResponse;
            })
        };
    });

    describe('createFormSubmission', () => {
        it('should create a new form submission', async () => {
            // Arrange
            const formData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '1234567890'
            };
    
            mockRequest.body = formData;

            // Mock Prisma create
            prismaTestClient.formSubmission.create = jest.fn().mockResolvedValue({
                id: 1,
                ...formData,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Act
            await createFormSubmission(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(responseObject).toHaveProperty('id', 1);
            expect(responseObject).toHaveProperty('firstName', 'John');
            expect(responseObject).toHaveProperty('lastName', 'Doe');
            expect(responseObject).toHaveProperty('email', 'john@example.com');
            expect(responseObject).toHaveProperty('phone', '1234567890');
        });

        it('should return 400 for invalid input', async () => {
            // Arrange
            mockRequest.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email', // Invalid email format
                phone: '1234567890'
            };

            // Act
            await createFormSubmission(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(responseObject).toHaveProperty('error', 'Invalid input data');
        });
    });
});


