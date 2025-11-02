import React from 'react';
import { DashboardIcon, EventsIcon, CalendarIcon, TicketIcon, SparklesIcon, LogoutIcon } from './icons';

type Page = 'Dashboard' | 'Events' | 'Calendar' | 'My Tickets' | 'AI Suggestions';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: Page;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg transition-colors ${
        isActive ? 'bg-teal-500/20 text-teal-300' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="ml-4 font-semibold">{label}</span>
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout }) => {
  return (
    <aside className="w-64 bg-gray-800 p-6 flex flex-col h-screen sticky top-0 border-r border-gray-700">
      <div className="flex items-center mb-10">
        <h1 className="text-2xl font-bold text-white">EventFlow</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-3">
          <NavItem icon={DashboardIcon} label="Dashboard" isActive={activePage === 'Dashboard'} onClick={() => setActivePage('Dashboard')} />
          <NavItem icon={EventsIcon} label="Events" isActive={activePage === 'Events'} onClick={() => setActivePage('Events')} />
          <NavItem icon={CalendarIcon} label="Calendar" isActive={activePage === 'Calendar'} onClick={() => setActivePage('Calendar')} />
          <NavItem icon={TicketIcon} label="My Tickets" isActive={activePage === 'My Tickets'} onClick={() => setActivePage('My Tickets')} />
          <NavItem icon={SparklesIcon} label="AI Suggestions" isActive={activePage === 'AI Suggestions'} onClick={() => setActivePage('AI Suggestions')} />
        </ul>
      </nav>
      <div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          className="flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          <LogoutIcon className="w-6 h-6" />
          <span className="ml-4 font-semibold">Logout</span>
        </a>
      </div>
    </aside>
  );
};