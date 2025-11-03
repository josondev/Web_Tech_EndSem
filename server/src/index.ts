import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));