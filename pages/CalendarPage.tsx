import React, { useState } from 'react';
import { Event, Guest, RSVPStatus, Task } from '../types';
import { CalendarView } from '../components/CalendarView';
import { EventDetailView } from '../components/EventDetailView';

interface CalendarPageProps {
  userEvents: Event[];
  onEditEvent: (event: Event) => void;
  eventHandlers: {
    onAddGuest: (eventId: string, name: string, email: string) => Promise<void>;
    onUpdateGuestStatus: (eventId: string, guestId: string, status: RSVPStatus) => Promise<void>;
    onDeleteGuest: (eventId: string, guestId: string) => Promise<void>;
    onAddTask: (eventId: string, description: string) => Promise<void>;
    onToggleTask: (eventId: string, taskId: string) => Promise<void>;
    onDeleteTask: (eventId: string, taskId: string) => Promise<void>;
  }
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ userEvents, onEditEvent, eventHandlers }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSelectEvent = (event: Event) => setSelectedEvent(event);
  const handleBackToCalendar = () => setSelectedEvent(null);

  return (
    <div className="p-8 h-full flex flex-col">
        <h1 className="text-3xl font-bold text-white mb-1">My Event Calendar</h1>
        <p className="text-gray-400 mb-6">Showing events you are registered for. Click on a date to see details.</p>

        <div className="bg-gray-800 rounded-lg shadow-lg flex-grow">
            {selectedEvent ? (
            <EventDetailView 
                event={selectedEvent} 
                onBack={handleBackToCalendar}
                onEdit={() => onEditEvent(selectedEvent)}
                {...eventHandlers}
            />
            ) : (
            <CalendarView 
                events={userEvents} 
                onSelectEvent={handleSelectEvent}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />
            )}
        </div>
    </div>
  );
};