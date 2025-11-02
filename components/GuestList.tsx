import React, { useState } from 'react';
import { Guest, RSVPStatus } from '../types';
import { UsersIcon, PlusIcon, TrashIcon } from './icons';

interface GuestListProps {
  guests: Guest[];
  onAddGuest: (name: string, email: string) => void;
  onUpdateGuestStatus: (guestId: string, status: RSVPStatus) => void;
  onDeleteGuest: (guestId: string) => void;
}

const rsvpOptions = Object.values(RSVPStatus);

const statusStyles: { [key in RSVPStatus]: string } = {
    [RSVPStatus.Attending]: "bg-green-500/20 text-green-300 border-green-500/30",
    [RSVPStatus.Maybe]: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    [RSVPStatus.Declined]: "bg-red-500/20 text-red-300 border-red-500/30",
    [RSVPStatus.Pending]: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export const GuestList: React.FC<GuestListProps> = ({ guests, onAddGuest, onUpdateGuestStatus, onDeleteGuest }) => {
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGuestName.trim() && newGuestEmail.trim()) {
      onAddGuest(newGuestName.trim(), newGuestEmail.trim());
      setNewGuestName('');
      setNewGuestEmail('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <UsersIcon className="w-6 h-6 mr-3 text-teal-400" />
          Guest List ({guests.length})
        </h3>
        <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 flex items-center justify-center shadow-sm"
            aria-label="Add new guest"
        >
            <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddGuest} className="flex flex-col md:flex-row gap-2 mb-4 p-4 bg-gray-700/50 rounded-lg">
          <input
            type="text"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            placeholder="Guest Name"
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500 text-white"
            required
          />
          <input
            type="email"
            value={newGuestEmail}
            onChange={(e) => setNewGuestEmail(e.target.value)}
            placeholder="Guest Email"
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500 text-white"
            required
          />
          <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
            Add
          </button>
        </form>
      )}

      <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {guests.length > 0 ? guests.map(guest => (
          <li key={guest.id} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-700 p-3 rounded-md">
            <div className="mb-2 md:mb-0">
              <p className="font-semibold text-gray-200">{guest.name}</p>
              <p className="text-sm text-gray-400">{guest.email}</p>
            </div>
            <div className="flex items-center gap-2">
                <select
                    value={guest.status}
                    onChange={(e) => onUpdateGuestStatus(guest.id, e.target.value as RSVPStatus)}
                    className={`text-sm font-medium rounded-md border py-1.5 pl-3 pr-8 appearance-none focus:ring-2 focus:ring-teal-500 ${statusStyles[guest.status]}`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                    {rsvpOptions.map(status => (
                    <option key={status} value={status} className="bg-gray-800 text-white">{status}</option>
                    ))}
                </select>
                <button onClick={() => onDeleteGuest(guest.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-500/10 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
          </li>
        )) : (
            <p className="text-center text-gray-400 py-4">No guests invited yet. Add one above!</p>
        )}
      </ul>
    </div>
  );
};