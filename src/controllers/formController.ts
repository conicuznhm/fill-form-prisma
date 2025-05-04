import {Request, Response} from 'express';
import prisma from '../config/db';
import {formSubmissionSchema, FormSubmissionInput} from '../validators/formValidator';

//post form
export const createFormSubmission = async (req: Request, res: Response) => {
    try {
        //Validate input
        const validatedData: FormSubmissionInput = formSubmissionSchema.parse(req.body);

        //Create form to database
        const submission = await prisma.formSubmission.create({
            data: validatedData
        });

        res.status(201).json(submission);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({error: error.message});
        } else {
            res.status(500).json({error: 'Internal server error'});
        }
    }
};

// list all forms
export const listFormSubmissions = async (_req: Request, res: Response) => {
    try {
        const submissions = await prisma.formSubmission.findMany({
            orderBy: {createdAt: 'desc'}
        });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching the forms'});
    }
};

// get form by id
export const getFormSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        const submission = await prisma.formSubmission.findUnique({
            where: {id: Number(id)}
        });

        if (!submission) {
            res.status(404).json({error: 'Form not found'});
            return;
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching the form'});
    }
};

// delete form by id
export const deleteFormSubmission = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const submission = await prisma.formSubmission.delete({
            where: {id: Number(id)}
        });

        res.json(submission);
    } catch (error) {
        res.status(500).json({error: 'An error occurred while deleting the form'});
    }
};

// update form by id
export const updateFormSubmission = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const validatedData: FormSubmissionInput = formSubmissionSchema.parse(req.body);

        const submission = await prisma.formSubmission.update({
            where: {id: Number(id)},
            data: validatedData
        });

        res.json(submission);
    } catch (error) {
        res.status(500).json({error: 'An error occurred while updating the form'});
    }
};