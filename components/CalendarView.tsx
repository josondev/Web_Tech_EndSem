import React from 'react';
import { Event } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarViewProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent, currentDate, setCurrentDate }) => {
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  let day = new Date(startDate);

  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-4 sm:p-6 text-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center space-x-2">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-700">
              <ChevronLeftIcon className="w-6 h-6 text-gray-400" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600">
              Today
            </button>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-700">
              <ChevronRightIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-700 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          {dayNames.map(d => (
            <div key={d} className="text-center font-semibold text-sm text-gray-400 py-3 bg-gray-800">
              {d}
            </div>
          ))}
          {days.map((d, i) => {
            const isCurrentMonth = d.getMonth() === currentDate.getMonth();
            const isToday = d.toDateString() === new Date().toDateString();
            const dateStr = d.toISOString().split('T')[0];
            const eventsOnDay = events.filter(e => e.date === dateStr);

            return (
              <div key={i} className={`bg-gray-800 p-2 min-h-[120px] ${!isCurrentMonth ? 'bg-gray-800/50' : ''}`}>
                <div className={`flex justify-center items-center w-8 h-8 rounded-full text-sm ${isToday ? 'bg-teal-500 text-white' : ''} ${!isCurrentMonth ? 'text-gray-500' : 'text-gray-200'}`}>
                  {d.getDate()}
                </div>
                <div className="mt-1 space-y-1">
                  {eventsOnDay.map(event => (
                    <button 
                      key={event.id}
                      onClick={() => onSelectEvent(event)}
                      className="w-full text-left text-xs p-1 bg-teal-500/20 text-teal-300 rounded truncate hover:bg-teal-500/40"
                    >
                      {event.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
};