import React, { useState } from 'react';
import { Event, ScrapedEvent, User } from '../types';
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon, CalendarIcon, LocationMarkerIcon } from '../components/icons';
import { scrapeEventsByLocation } from '../services/apiService';

interface EventsPageProps {
  userEvents: Event[];
  currentUser: User;
  onCreateEvent: () => void;
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: Event) => void;
  onOpenRegisterModal: (event: ScrapedEvent) => void;
}

const EventRow: React.FC<{ event: Event; onEdit: () => void; onDelete: () => void; isAdmin: boolean; }> = ({ event, onEdit, onDelete, isAdmin }) => {
    const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
    });
    const status = new Date(event.date) >= new Date() ? 'Upcoming' : 'Past';

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-700/50">
            <td className="py-4 px-6 font-medium text-white">{event.name}</td>
            <td className="py-4 px-6">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${status === 'Upcoming' ? 'bg-teal-500/20 text-teal-300' : 'bg-gray-500/20 text-gray-300'}`}>
                    {status}
                </span>
            </td>
            <td className="py-4 px-6">{formattedDate}</td>
            <td className="py-4 px-6">{event.location}</td>
            <td className="py-4 px-6 text-center">{event.guests.length}</td>
            {isAdmin && <td className="py-4 px-6 text-gray-400">{event.userName}</td>}
            <td className="py-4 px-6">
                <div className="flex justify-center items-center gap-2">
                    <button onClick={onEdit} className="p-2 text-gray-400 hover:text-teal-400"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </td>
        </tr>
    );
};

const ScrapedEventCard: React.FC<{ event: ScrapedEvent; onRegister: (event: ScrapedEvent) => void; }> = ({ event, onRegister }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
        <div>
            <h4 className="font-bold text-teal-300">{event.name}</h4>
            <div className="flex items-center text-xs text-gray-400 mt-1 mb-2">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{event.date}</span>
            </div>
            <div className="flex items-center text-xs text-gray-400 mt-1 mb-2">
                <LocationMarkerIcon className="w-4 h-4 mr-2" />
                <span>{event.location}</span>
            </div>
            <p className="text-sm text-gray-300 line-clamp-3">{event.description}</p>
        </div>
        <button 
            onClick={() => onRegister(event)}
            className="mt-4 w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
        >
            Register
        </button>
    </div>
);


export const EventsPage: React.FC<EventsPageProps> = ({ userEvents, currentUser, onCreateEvent, onDeleteEvent, onEditEvent, onOpenRegisterModal }) => {
  const [locationQuery, setLocationQuery] = useState('');
  const [isFinding, setIsFinding] = useState(false);
  const [findError, setFindError] = useState<string | null>(null);
  const [foundEvents, setFoundEvents] = useState<ScrapedEvent[] | null>(null);
  const isAdmin = currentUser.role === 'admin';

  const handleFindEvents = async () => {
    if (!locationQuery.trim()) {
        setFindError("Please enter a location to search.");
        return;
    }
    setIsFinding(true);
    setFindError(null);
    setFoundEvents(null);
    const results = await scrapeEventsByLocation(locationQuery);
    if (results) {
        setFoundEvents(results);
    } else {
        setFindError("Could not find events for this location. Please try again.");
    }
    setIsFinding(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">My Events</h1>
                {isAdmin && <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-300">Admin View</span>}
            </div>
            <p className="text-gray-400">Manage all your created events in one place.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search public events by location..." 
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-4 pr-4 focus:outline-none focus:ring-1 focus:ring-teal-500 text-white w-64" 
                />
            </div>
            <button onClick={handleFindEvents} disabled={isFinding} className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center gap-2 disabled:bg-gray-800">
                {isFinding ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <SearchIcon className="h-5 w-5"/>}
                Find Events
            </button>
            <button onClick={onCreateEvent} className="flex items-center gap-2 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600">
                <PlusIcon className="w-5 h-5"/>
                Create Event
            </button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                <tr>
                    <th scope="col" className="py-3 px-6">Event</th>
                    <th scope="col" className="py-3 px-6">Status</th>
                    <th scope="col" className="py-3 px-6">Date</th>
                    <th scope="col" className="py-3 px-6">Location</th>
                    <th scope="col" className="py-3 px-6 text-center">Guests</th>
                    {isAdmin && <th scope="col" className="py-3 px-6">Owner</th>}
                    <th scope="col" className="py-3 px-6 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {userEvents.length > 0 ? userEvents.map(event => (
                    <EventRow key={event.id} event={event} onEdit={() => onEditEvent(event)} onDelete={() => onDeleteEvent(event.id)} isAdmin={isAdmin} />
                )) : (
                    <tr>
                        <td colSpan={isAdmin ? 7 : 6} className="text-center py-16">
                            <h3 className="text-xl text-white">No events found.</h3>
                            <p className="text-gray-400 mt-2">Click "Create Event" to get started.</p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {(isFinding || findError || foundEvents) && (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Public Events Found for "{locationQuery}"</h2>
            {isFinding && <div className="text-center text-gray-400 py-10">Searching for events...</div>}
            {findError && <p className="text-red-400">{findError}</p>}
            {foundEvents && (
                foundEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {foundEvents.map((event, index) => <ScrapedEventCard key={index} event={event} onRegister={onOpenRegisterModal} />)}
                    </div>
                ) : (
                    <div className="text-center bg-gray-800 rounded-lg py-16">
                        <h3 className="text-xl text-white">No Public Events Found</h3>
                        <p className="text-gray-400 mt-2">Try a different location or a broader search term.</p>
                    </div>
                )
            )}
        </div>
      )}
    </div>
  );
};