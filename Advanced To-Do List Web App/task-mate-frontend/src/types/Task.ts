export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  category: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
} 