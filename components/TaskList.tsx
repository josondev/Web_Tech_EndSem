import React, { useState } from 'react';
import { Task } from '../types';
import { ClipboardListIcon, PlusIcon, TrashIcon } from './icons';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (description: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <ClipboardListIcon className="w-6 h-6 mr-3 text-teal-400" />
        Tasks
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-teal-400">Progress</span>
            <span className="text-sm font-medium text-teal-400">{completedTasks} of {totalTasks} complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500 text-white"
        />
        <button type="submit" className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 flex items-center justify-center">
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>

      <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {tasks.length > 0 ? tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="h-5 w-5 rounded border-gray-500 bg-gray-600 text-teal-500 focus:ring-teal-500 cursor-pointer"
              />
              <span className={`ml-3 text-gray-300 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.description}
              </span>
            </div>
            <button onClick={() => onDeleteTask(task.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-500/10 transition-colors">
              <TrashIcon className="w-5 h-5" />
            </button>
          </li>
        )) : (
            <p className="text-center text-gray-400 py-4">No tasks yet. Add one above!</p>
        )}
      </ul>
    </div>
  );
};