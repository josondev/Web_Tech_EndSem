import React, { useState } from 'react';
import { Event } from '../types';
import { CalendarIcon, ClockIcon, LocationMarkerIcon } from './icons';

interface PublicEventPageProps {
  event?: Event;
  onRegister: (eventId: string, name: string, email: string) => Promise<void>;
}

export const PublicEventPage: React.FC<PublicEventPageProps> = ({ event, onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!event || !event.isPublic) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-200">Event Not Found</h1>
          <p className="text-gray-400 mt-2">The event you are looking for is either private or does not exist.</p>
          <a href="/" className="mt-6 inline-block bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600">
            Back to Home
          </a>
        </div>
      </div>
    );
  }
  
  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(name && email) {
        setIsLoading(true);
        await onRegister(event.id, name, email);
        setIsRegistered(true);
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <div className="container mx-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">{event.name}</h1>
            <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-3 text-gray-400 mb-6 border-b pb-6 border-gray-700">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-teal-400" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-teal-400" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <LocationMarkerIcon className="w-5 h-5 text-teal-400" />
                <span>{event.location}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-2">About this event</h2>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{event.description}</p>
          </div>
          <div className="bg-gray-800/50 px-8 md:px-12 py-10">
            {isRegistered ? (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-teal-400">You're Registered!</h2>
                <p className="text-gray-300 mt-2">Thank you for registering. We've added you to the guest list.</p>
              </div>
            ) : (
                <>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Register for this Event</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                    <div>
                        <label htmlFor="reg-name" className="block text-sm font-medium text-gray-400">Full Name</label>
                        <input
                        type="text"
                        id="reg-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-400">Email Address</label>
                        <input
                        type="email"
                        id="reg-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors shadow-md text-lg disabled:bg-teal-800"
                    >
                        {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : 'Register'}
                    </button>
                    </form>
                </>
            )}
          </div>
        </div>
        <p className="text-center text-gray-500 mt-8 text-sm">Powered by EventFlow</p>
      </div>
    </div>
  );
};