import React, { useState } from 'react';
import { Event, Guest, RSVPStatus, Task } from '../types';
import { GuestList } from './GuestList';
import { TaskList } from './TaskList';
import { CalendarIcon, ClockIcon, LocationMarkerIcon, PencilIcon } from './icons';

interface EventDetailViewProps {
  event: Event;
  onBack: () => void;
  onEdit: () => void;
  onAddGuest: (eventId: string, name: string, email: string) => Promise<void>;
  onUpdateGuestStatus: (eventId: string, guestId: string, status: RSVPStatus) => Promise<void>;
  onDeleteGuest: (eventId: string, guestId: string) => Promise<void>;
  onAddTask: (eventId: string, description: string) => Promise<void>;
  onToggleTask: (eventId: string, taskId: string) => Promise<void>;
  onDeleteTask: (eventId: string, taskId: string) => Promise<void>;
}

const ShareEvent: React.FC<{ event: Event }> = ({ event }) => {
  const [copied, setCopied] = useState(false);
  if (!event.isPublic) {
    return null;
  }
  
  const publicUrl = `${window.location.origin}${window.location.pathname}?event=${event.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-teal-500/10 border-l-4 border-teal-500 p-4 mt-8 rounded-r-lg">
      <h3 className="text-lg font-semibold text-teal-300">Share Event</h3>
      <p className="text-teal-400 text-sm mt-1 mb-3">This event is public. Share the link below for guests to register.</p>
      <div className="flex gap-2">
        <input type="text" readOnly value={publicUrl} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300" />
        <button onClick={handleCopy} className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event, onBack, onEdit, onAddGuest, onUpdateGuestStatus, onDeleteGuest, onAddTask, onToggleTask, onDeleteTask
}) => {
  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 text-gray-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-teal-400 hover:text-teal-300 font-semibold">
            &larr; Back to Calendar
          </button>
          <button onClick={onEdit} className="flex items-center gap-2 bg-gray-700 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-600 border border-gray-600 shadow-sm">
            <PencilIcon className="w-4 h-4" />
            Edit Event
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">{event.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <LocationMarkerIcon className="w-5 h-5 text-gray-500" />
              <span>{event.location}</span>
            </div>
          </div>
          <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
          <ShareEvent event={event} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GuestList 
            guests={event.guests}
            onAddGuest={(name, email) => onAddGuest(event.id, name, email)}
            onUpdateGuestStatus={(guestId, status) => onUpdateGuestStatus(event.id, guestId, status)}
            onDeleteGuest={(guestId) => onDeleteGuest(event.id, guestId)}
          />
          <TaskList
            tasks={event.tasks}
            onAddTask={(description) => onAddTask(event.id, description)}
            onToggleTask={(taskId) => onToggleTask(event.id, taskId)}
            onDeleteTask={(taskId) => onDeleteTask(event.id, taskId)}
          />
        </div>
      </div>
    </div>
  );
};