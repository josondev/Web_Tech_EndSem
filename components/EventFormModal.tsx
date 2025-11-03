import React, { useState, useEffect } from 'react';
import { Event, Task } from '../types';
import { getEventSuggestions } from '../services/apiService';
import { SparklesIcon, PlusIcon } from './icons';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'guests' | 'tasks' | 'userId'> & { id?: string; tasks?: Task[], isPublic: boolean }) => void;
  eventToEdit?: Event | null;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({ isOpen, onClose, onSave, eventToEdit }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name);
      setDate(eventToEdit.date);
      setTime(eventToEdit.time);
      setLocation(eventToEdit.location);
      setDescription(eventToEdit.description);
      setTasks(eventToEdit.tasks);
      setIsPublic(eventToEdit.isPublic);
    } else {
      resetForm();
    }
  }, [eventToEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setDate('');
    setTime('');
    setLocation('');
    setDescription('');
    setTasks([]);
    setIsPublic(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: eventToEdit?.id,
      name,
      date,
      time,
      location,
      description,
      tasks,
      isPublic,
    });
    onClose();
  };
  
  const handleGetAISuggestions = async () => {
    if (!name) {
      setAiError("Please enter an event name first.");
      return;
    }
    setIsAISuggesting(true);
    setAiError(null);
    const suggestions = await getEventSuggestions(name);
    if (suggestions) {
      setDescription(prev => suggestions.suggestedDescription || prev);
      const newTasks = suggestions.suggestedTasks.map(taskDesc => ({
        id: `task-${Date.now()}-${Math.random()}`,
        description: taskDesc,
        completed: false,
      }));
      setTasks(prevTasks => [...prevTasks, ...newTasks]);
    } else {
      setAiError("Could not fetch AI suggestions. Please try again.");
    }
    setIsAISuggesting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{eventToEdit ? 'Edit Event' : 'Create New Event'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Event Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-400">Date</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-400">Time</label>
              <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white" />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-400">Location</label>
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"></textarea>
          </div>
          
          <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
            <span className="text-sm font-medium text-gray-200">Public Registration</span>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`${isPublic ? 'bg-teal-500' : 'bg-gray-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500`}
            >
              <span className={`${isPublic ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
            </button>
          </div>
          
          <div>
            <button
              type="button"
              onClick={handleGetAISuggestions}
              disabled={isAISuggesting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 disabled:bg-teal-800"
            >
              {isAISuggesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Getting suggestions...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Get AI Suggestions for Description & Tasks</span>
                </>
              )}
            </button>
            {aiError && <p className="text-red-400 text-sm mt-2">{aiError}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500">Cancel</button>
            <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">{eventToEdit ? 'Save Changes' : 'Create Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};