import React, { useState } from 'react';
import { Task } from '../types/Task';
import { format, isToday, isFuture, isPast, differenceInDays, startOfToday, addDays } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  view: 'timeline' | 'completed' | 'all';
}

const DAYS_TO_SHOW = 14; // Show 2 weeks
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i); // 24 hours

const COLORS = {
  'High': 'from-red-500 to-red-400',
  'Medium': 'from-yellow-500 to-yellow-400',
  'Low': 'from-blue-500 to-blue-400',
  'default': 'from-purple-500 to-purple-400'
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDeleteTask,
  onEditTask,
  onToggleComplete,
  view
}) => {
  const [showTimeSlots, setShowTimeSlots] = useState(true);
  const today = startOfToday();
  const dates = Array.from({ length: DAYS_TO_SHOW }, (_, i) => addDays(today, i));

  // Filter tasks based on view
  const filteredTasks = tasks.filter(task => {
    if (view === 'completed') return task.completed;
    if (view === 'timeline') return !task.completed;
    return true; // 'all' view shows all tasks
  });

  const getTaskPosition = (task: Task) => {
    const startDate = new Date(task.dueDate);
    const daysFromToday = differenceInDays(startDate, today);
    const left = Math.max(0, Math.min(daysFromToday, DAYS_TO_SHOW - 1));
    const hour = new Date(task.dueDate).getHours();
    const minutes = new Date(task.dueDate).getMinutes();
    const top = ((hour + minutes / 60) / 24) * 100;
    return { 
      left: `${(left / DAYS_TO_SHOW) * 100}%`,
      width: `${(1 / DAYS_TO_SHOW) * 100}%`,
      top: `${top}%`
    };
  };

  const getTaskColor = (task: Task) => {
    if (task.completed) {
      return 'from-gray-500 to-gray-400';
    }
    return COLORS[task.category as keyof typeof COLORS] || COLORS.default;
  };

  const formatTaskTime = (date: string) => {
    const taskDate = new Date(date);
    const hours = taskDate.getHours();
    const minutes = taskDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const TaskCard = ({ task, isTimelineView = false }: { task: Task; isTimelineView?: boolean }) => {
    const taskDate = new Date(task.dueDate);
    const isPastDue = isPast(taskDate) && !task.completed;

    return (
      <div 
        className={`
          ${isTimelineView 
            ? 'h-full m-1 bg-gradient-to-r shadow-lg hover:shadow-xl transform hover:scale-105'
            : 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md'
          } 
          ${getTaskColor(task)} 
          rounded-lg transition-all duration-200 group
          ${task.completed ? 'opacity-75' : 'opacity-100'}
        `}
        style={isTimelineView ? { minHeight: '80px' } : {}}
      >
        <div className={`flex ${isTimelineView ? 'flex-col' : ''} justify-between h-full relative z-10`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task._id, !task.completed);
              }}
              className={`
                flex-shrink-0 w-8 h-8 rounded-full 
                flex items-center justify-center 
                transition-all duration-200 
                hover:scale-110 
                ${task.completed
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-white border-2 border-gray-300 hover:border-green-500 hover:bg-green-50'
                }
                ${isTimelineView ? 'shadow-md' : ''}
              `}
              title={task.completed ? 'Mark as pending' : 'Mark as completed'}
            >
              {task.completed ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <h3 className={`text-base font-medium truncate ${
                task.completed 
                  ? 'text-gray-500 line-through' 
                  : isTimelineView ? 'text-white' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm truncate mt-0.5 ${
                  task.completed 
                    ? 'text-gray-400' 
                    : isTimelineView ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
              {!isTimelineView && (
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Due: {format(taskDate, 'MMM d, yyyy')} at {formatTaskTime(task.dueDate)}
                  </span>
                  {task.completed && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completed: {format(new Date(task.updatedAt), 'MMM d')} at {formatTaskTime(task.updatedAt)}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {isTimelineView && (
            <div className="mt-auto pt-2 flex items-center justify-between">
              <span className="text-sm text-white font-medium">
                {formatTaskTime(task.dueDate)}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task._id);
                  }}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">
            {view === 'completed' ? 'No completed tasks yet' : 
             view === 'timeline' ? 'No pending tasks' :
             'No tasks found'}
          </p>
          <p className="text-gray-400 text-sm">
            {view === 'completed' 
              ? 'Complete some tasks to see them here'
              : view === 'timeline'
              ? 'Add a new task to get started'
              : 'Add your first task to get started'}
          </p>
        </div>
      </div>
    );
  }

  if (view === 'completed' || view === 'all') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {view === 'completed' ? 'Completed Tasks' : 'All Tasks'}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {filteredTasks.map((task) => (
              <div key={task._id}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="inline-flex rounded-lg shadow-sm">
          <button
            onClick={() => setShowTimeSlots(!showTimeSlots)}
            className={`px-4 py-2 text-sm font-medium rounded-lg
              ${showTimeSlots 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'} 
              transition-colors duration-200`}
          >
            {showTimeSlots ? 'Hide Time Slots' : 'Show Time Slots'}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm border border-white/20">
        {/* Timeline Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-white/20 backdrop-blur-sm">
          <div className="grid grid-cols-14 gap-0">
            {dates.map((date, index) => (
              <div
                key={index}
                className={`text-center py-3 text-xs font-medium border-r border-white/10 ${
                  isToday(date) ? 'bg-indigo-500/20 text-indigo-700 font-bold' : 'text-gray-600'
                }`}
              >
                <div className="font-semibold">{format(date, 'EEE')}</div>
                <div>{format(date, 'd')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Timeline */}
        <div className="relative" style={{ height: showTimeSlots ? '800px' : '400px' }}>
          {/* Time Slots */}
          {showTimeSlots && (
            <div className="absolute inset-0 grid grid-cols-1 gap-0" style={{ zIndex: 0 }}>
              {TIME_SLOTS.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-gray-200/20 relative"
                  style={{ height: `${100 / 24}%` }}
                >
                  <span className="absolute -left-12 top-0 text-xs text-gray-500">
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Time Grid */}
          <div className="absolute inset-0 grid grid-cols-14 gap-0">
            {dates.map((date, index) => (
              <div
                key={index}
                className={`border-r border-white/10 h-full ${
                  isToday(date) ? 'bg-indigo-500/10' : ''
                }`}
              />
            ))}
          </div>

          {/* Tasks */}
          <div className="relative h-full">
            {filteredTasks.map((task) => {
              const position = getTaskPosition(task);
              return (
                <div
                  key={task._id}
                  className="absolute h-16"
                  style={{
                    left: position.left,
                    width: position.width,
                    top: showTimeSlots ? position.top : 'auto',
                    transform: showTimeSlots ? 'none' : 'translateY(8px)'
                  }}
                >
                  <TaskCard task={task} isTimelineView={true} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 