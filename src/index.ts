import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import formRoutes from './routes/formRoutes';
import {errorHandler} from './middlewares/errorMiddleware';
import morgan from 'morgan';

// Load environment variables from .env file
dotenv.config();

const app = express();
// const PORT = Number(process.env.PORT || 8899);
const PORT = parseInt(process.env.PORT || '8899', 10);

// Middleware
// app.use(cors());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Use morgan for logging HTTP requests
app.use(morgan('dev'));

// Routes
app.use('/', formRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check route
app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});