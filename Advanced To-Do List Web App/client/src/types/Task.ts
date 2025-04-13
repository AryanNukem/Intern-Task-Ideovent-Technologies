export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;  // ISO date string
  category: string;
  completed: boolean;
  duration?: number;  // Duration in days
  createdAt: string;
  updatedAt: string;
} 