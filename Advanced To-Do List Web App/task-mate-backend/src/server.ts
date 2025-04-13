import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/task-mate')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/tasks', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 