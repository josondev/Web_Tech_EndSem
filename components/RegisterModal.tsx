import React from 'react';
import { ScrapedEvent } from '../types';
import { CalendarIcon, LocationMarkerIcon } from './icons';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  event: ScrapedEvent | null;
  isLoading: boolean;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegister, event, isLoading }) => {
  if (!isOpen || !event) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg text-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Confirm Registration</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div>
          <p className="text-gray-400 mb-4">You are about to register for the following event. This will add it to your event list.</p>
          <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-teal-300">{event.name}</h3>
            <div className="flex items-center text-sm text-gray-400 mt-2">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <LocationMarkerIcon className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <p className="text-sm text-gray-300 mt-3 line-clamp-4">{event.description}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-6">
          <button type="button" onClick={onClose} disabled={isLoading} className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500 disabled:opacity-50">Cancel</button>
          <button
            type="button"
            onClick={onRegister}
            disabled={isLoading}
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 flex items-center justify-center w-40 disabled:bg-teal-800"
          >
            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Confirm & Register'}
          </button>
        </div>
      </div>
    </div>
  );
};