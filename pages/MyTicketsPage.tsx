import React from 'react';
import { Event, User, RSVPStatus } from '../types';
import { CalendarIcon, LocationMarkerIcon, UsersIcon } from '../components/icons';

interface MyTicketsPageProps {
  allEvents: Event[];
  currentUser: User;
}

const TicketCard: React.FC<{ event: Event }> = ({ event }) => {
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
              <span className="text-gray-300">{event.guests.filter(g => g.status === RSVPStatus.Attending).length} Guests Attending</span>
            </div>
             <div className="space-x-2">
                <button className="px-4 py-2 text-sm font-semibold bg-gray-700 text-white rounded-md hover:bg-gray-600">View Details</button>
                <button className="px-4 py-2 text-sm font-semibold bg-red-500/80 text-white rounded-md hover:bg-red-500">Cancel Registration</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

export const MyTicketsPage: React.FC<MyTicketsPageProps> = ({ allEvents, currentUser }) => {
  const registeredEvents = allEvents.filter(event =>
    event.guests.some(guest => guest.email === currentUser.email && guest.status === RSVPStatus.Attending)
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-1">My Tickets</h1>
      <p className="text-gray-400 mb-6">A list of events you've registered for.</p>

      {registeredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map(event => (
            <TicketCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold text-white">No Tickets Yet</h2>
          <p className="text-gray-400 mt-2">You haven't registered for any events.</p>
        </div>
      )}
    </div>
  );
};