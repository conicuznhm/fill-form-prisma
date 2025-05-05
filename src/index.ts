import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import formRoutes from './routes/formRoutes';
import {errorHandler} from './middlewares/errorMiddleware';
import morgan from 'morgan';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});