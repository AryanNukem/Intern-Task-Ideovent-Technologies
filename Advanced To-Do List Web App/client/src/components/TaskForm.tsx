import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, '_id'>) => Promise<void>;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [date, setDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(task?.dueDate ? new Date(task.dueDate).toTimeString().slice(0, 5) : new Date().toTimeString().slice(0, 5));
  const [category, setCategory] = useState(task?.category || 'Medium');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      const dueDate = new Date(task.dueDate);
      setDate(dueDate.toISOString().split('T')[0]);
      setTime(dueDate.toTimeString().slice(0, 5));
      setCategory(task.category);
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().slice(0, 5));
    setCategory('Medium');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!title.trim()) {
        setError('Title is required');
        return;
      }

      if (!date || !time) {
        setError('Due date and time are required');
        return;
      }

      const dueDate = new Date(`${date}T${time}`);
      
      if (isNaN(dueDate.getTime())) {
        setError('Invalid date or time');
        return;
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate.toISOString(),
        category: category || 'Medium',
        completed: false,
        createdAt: task?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSubmit(taskData);
      if (!task) {
        resetForm();
      }
    } catch (error) {
      console.error('Failed to submit task:', error);
      setError('Failed to save task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter task description (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dueDate"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700">
            Due Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="dueTime"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {task ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}; 