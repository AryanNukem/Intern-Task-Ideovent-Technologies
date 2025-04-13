import mongoose from 'mongoose';
import Task from '../models/Task';

const deleteAllTasks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/task-mate');
    console.log('Connected to MongoDB');

    // Delete all tasks
    await Task.deleteMany({});
    console.log('All tasks have been deleted successfully');

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the script
deleteAllTasks(); 