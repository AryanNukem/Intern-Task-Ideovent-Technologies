import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from './types/Task';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import SearchFilter from './components/SearchFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'timeline' | 'completed' | 'all'>('timeline');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (view === 'completed') {
      setFilter('completed');
    } else if (view === 'timeline') {
      setFilter('pending');
    } else if (view === 'all') {
      setFilter('all');
    }
  }, [view]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setIsLoading(false);
      toast.error('Failed to fetch tasks');
    }
  };

  const handleAddTask = async (taskData: Omit<Task, '_id'>) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/tasks`, taskData);
      const newTask = response.data;
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast.success('Task added successfully!');
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      toast.error('Failed to add task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      setIsLoading(true);
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
      const updatedTask = response.data;
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
      setEditingTask(undefined);
      toast.success('Task updated successfully!');
    } catch (err) {
      setError('Failed to update task');
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully!');
    } catch (err) {
      setError('Failed to delete task');
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter === 'completed') {
      setView('completed');
    } else if (newFilter === 'pending') {
      setView('timeline');
    } else if (newFilter === 'all') {
      setView('all');
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, { 
        completed,
        updatedAt: new Date().toISOString()
      });
      const updatedTask = response.data;
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
      
      if (completed && view === 'timeline') {
        setView('completed');
        setFilter('completed');
      }
      
      toast.success(completed ? 'Task completed!' : 'Task marked as pending!');
    } catch (err) {
      setError('Failed to update task status');
      toast.error('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed);
    return matchesSearch && matchesFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (view === 'all') {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
    }
    return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            Task Mate
          </h1>
          <p className="text-indigo-600 text-lg">
            Organize your tasks with style
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h2>
                </div>
                <div className="p-6">
                  <TaskForm
                    task={editingTask}
                    onSubmit={async (taskData) => {
                      if (editingTask) {
                        await handleUpdateTask(editingTask._id, taskData);
                      } else {
                        await handleAddTask(taskData);
                      }
                    }}
                    onCancel={editingTask ? () => setEditingTask(undefined) : undefined}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setView('all');
                        setFilter('all');
                      }}
                      className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200
                        ${view === 'all'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      All Tasks
                    </button>
                    <div className="flex rounded-lg bg-gray-100 p-1">
                      <button
                        onClick={() => {
                          setView('timeline');
                          setFilter('pending');
                        }}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200
                          ${view === 'timeline'
                            ? 'bg-white text-indigo-600 shadow'
                            : 'text-gray-600 hover:text-indigo-600'
                          }`}
                      >
                        Timeline
                      </button>
                      <button
                        onClick={() => {
                          setView('completed');
                          setFilter('completed');
                        }}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200
                          ${view === 'completed'
                            ? 'bg-white text-indigo-600 shadow'
                            : 'text-gray-600 hover:text-indigo-600'
                          }`}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <SearchFilter
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filter={filter}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <TaskList
                tasks={sortedTasks}
                onDeleteTask={handleDeleteTask}
                onEditTask={setEditingTask}
                onToggleComplete={handleToggleComplete}
                view={view}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 