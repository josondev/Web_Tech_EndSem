import React from 'react';
import { Event } from '../types';
import { CalendarIcon, LocationMarkerIcon, PlusIcon, UsersIcon } from '../components/icons';

interface DashboardPageProps {
  userEvents: Event[];
  onCreateEvent: () => void;
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{event.name}</h3>
        <div className="flex items-center text-gray-400 mb-4">
          <CalendarIcon className="w-5 h-5 mr-2" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-400 mb-4">
          <LocationMarkerIcon className="w-5 h-5 mr-2" />
          <span>{event.location}</span>
        </div>
        <p className="text-gray-300 mb-6 line-clamp-3">{event.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <UsersIcon className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-300">{event.guests.length} Guests</span>
          </div>
          <div className="space-x-2">
              <button className="px-4 py-2 text-sm font-semibold bg-gray-700 text-white rounded-md hover:bg-gray-600">View Details</button>
              <button className="px-4 py-2 text-sm font-semibold bg-teal-500 text-white rounded-md hover:bg-teal-600">Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ userEvents, onCreateEvent }) => {
  const upcomingEvents = userEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">An overview of your upcoming events.</p>
        </div>
        <button onClick={onCreateEvent} className="flex items-center gap-2 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors shadow">
            <PlusIcon className="w-5 h-5"/>
            Create Event
        </button>
      </div>
      
      <h2 className="text-2xl font-semibold text-white mb-4">Upcoming Events</h2>
      
      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <h3 className="text-xl text-white">No upcoming events.</h3>
          <p className="text-gray-400 mt-2">Why not create one?</p>
        </div>
      )}
    </div>
  );
};