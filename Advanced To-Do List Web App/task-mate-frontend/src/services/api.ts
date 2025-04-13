import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await axios.get<Task[]>(`${API_URL}/tasks`);
    return response.data;
  },

  // Create a new task
  createTask: async (taskData: Omit<Task, '_id'>) => {
    const response = await axios.post<Task>(`${API_URL}/tasks`, taskData);
    return response.data;
  },

  // Update a task
  updateTask: async (id: string, taskData: Partial<Task>) => {
    const response = await axios.put<Task>(`${API_URL}/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: string) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
  },
}; 