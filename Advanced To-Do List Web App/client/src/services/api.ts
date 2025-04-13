import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  // Get all tasks
  getTasks: () => api.get<Task[]>('/tasks'),

  // Create a new task
  createTask: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Task>('/tasks', task),

  // Update a task
  updateTask: (id: string, task: Partial<Task>) =>
    api.put<Task>(`/tasks/${id}`, task),

  // Delete a task
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
}; 