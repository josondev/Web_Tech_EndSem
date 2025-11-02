import React from 'react';
import { CalendarIcon, UsersIcon, ClipboardListIcon } from './icons';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 text-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-down">
          EventFlow
        </h1>
        <p className="text-lg md:text-2xl text-teal-100 mb-8">
          Organize Your Events, Seamlessly. From birthday parties to professional meetups, Eventify Pro is your all-in-one solution for event planning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 text-left">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white/20">
            <CalendarIcon className="w-10 h-10 text-white mb-4" />
            <h3 className="text-xl font-bold mb-2">Manage Events</h3>
            <p className="text-teal-200">Create, edit, and view all your events in a beautiful, intuitive calendar.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white/20">
            <UsersIcon className="w-10 h-10 text-white mb-4" />
            <h3 className="text-xl font-bold mb-2">Track Guests</h3>
            <p className="text-teal-200">Easily invite guests, monitor RSVPs, and keep your guest list organized.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white/20">
            <ClipboardListIcon className="w-10 h-10 text-white mb-4" />
            <h3 className="text-xl font-bold mb-2">Assign Tasks</h3>
            <p className="text-teal-200">Stay on top of your to-do list with integrated task management for each event.</p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="bg-white text-teal-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>
      </div>

      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};