import React, { useState, useCallback, useEffect } from 'react';
import { Event, Guest, RSVPStatus, Task, User, ScrapedEvent } from './types';
import * as api from './services/apiService';
import { EventFormModal } from './components/EventFormModal';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { PublicEventPage } from './components/PublicEventPage';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { CalendarPage } from './pages/CalendarPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { AISuggestionsPage } from './pages/AISuggestionsPage';
import { SearchIcon, PlusIcon } from './components/icons';
import { RegisterModal } from './components/RegisterModal';

type Page = 'Dashboard' | 'Events' | 'Calendar' | 'My Tickets' | 'AI Suggestions';

const App: React.FC = () => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [appStarted, setAppStarted] = useState(false);
  
  const [publicEventId, setPublicEventId] = useState<string | null>(null);
  const [publicEventData, setPublicEventData] = useState<Event | undefined>(undefined);

  const [activePage, setActivePage] = useState<Page>('Dashboard');

  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [eventToRegister, setEventToRegister] = useState<ScrapedEvent | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event');
    if (eventId) {
      setPublicEventId(eventId);
    }

    const checkAuth = async () => {
      setIsLoading(true);
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      setIsLoading(false);
    };

    if (!eventId) { // Don't check auth if viewing a public page
        checkAuth();
    } else {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchPublicEvent = async () => {
      if(publicEventId) {
        setIsLoading(true);
        try {
          const event = await api.getPublicEventById(publicEventId);
          setPublicEventData(event);
        } catch (error) {
          console.error("Failed to fetch public event", error);
          setPublicEventData(undefined);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchPublicEvent();
  }, [publicEventId]);
  
  useEffect(() => {
      const fetchEvents = async () => {
          if (currentUser) {
              setIsLoading(true);
              const events = await api.getEventsForUser();
              setUserEvents(events);
              setIsLoading(false);
          } else {
              setUserEvents([]);
          }
      };
      fetchEvents();
  }, [currentUser]);

  const handleStartApp = () => setAppStarted(true);
  
  const handleLogin = async (email: string, password: string): Promise<string | null> => {
    const { user, error } = await api.loginUser({ email, password });
    if (user) {
        setCurrentUser(user);
        return null;
    }
    return error || "An unknown error occurred.";
  };
  
  const handleSignUp = async (name: string, email: string, password: string): Promise<string | null> => {
    const { user, error } = await api.signupUser({ name, email, password });
     if (user) {
        setCurrentUser(user);
        return null;
    }
    return error || "An unknown error occurred.";
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    setAppStarted(false);
    setActivePage('Dashboard');
  };

  const handleOpenModal = (event?: Event) => {
    setEventToEdit(event || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEventToEdit(null);
  };
  
  const handleSaveEvent = async (eventData: Omit<Event, 'id' | 'guests' | 'tasks' | 'userId'> & { id?: string; tasks?: Task[], isPublic: boolean }) => {
    if (!currentUser) return;
    
    // Backend will use token to set userId
    const payload = { ...eventData };
    const savedEvent = await api.saveEvent(payload);

    if (eventData.id) {
      setUserEvents(prev => prev.map(e => e.id === savedEvent.id ? savedEvent : e));
    } else {
      setUserEvents(prev => [...prev, savedEvent]);
    }
  };

  const handlePublicRegister = async (eventId: string, name: string, email: string) => {
    await api.publicRegisterToEvent(eventId, { name, email });
  };
  
  const handleOpenRegisterModal = (event: ScrapedEvent) => {
    setEventToRegister(event);
    setRegisterModalOpen(true);
  };
  const handleCloseRegisterModal = () => {
    setEventToRegister(null);
    setRegisterModalOpen(false);
  };
  const handleConfirmRegistration = async () => {
      if (!eventToRegister || !currentUser) return;
      setIsRegistering(true);
      const newEvent = await api.registerForPublicEvent(eventToRegister);
      setUserEvents(prev => [...prev, newEvent]);
      setIsRegistering(false);
      handleCloseRegisterModal();
  };
  
  const updateEventState = (eventId: string, updateFn: (event: Event) => Event) => {
      setUserEvents(prev => prev.map(e => e.id === eventId ? updateFn(e) : e));
  };
  
  const handleAddGuest = async (eventId: string, name: string, email: string) => {
    const newGuest = await api.addGuestToEvent(eventId, { name, email });
    updateEventState(eventId, event => ({ ...event, guests: [...event.guests, newGuest] }));
  };

  const handleUpdateGuestStatus = async (eventId: string, guestId: string, status: RSVPStatus) => {
    await api.updateGuestStatus(eventId, guestId, status);
    updateEventState(eventId, event => ({ ...event, guests: event.guests.map(g => g.id === guestId ? { ...g, status } : g) }));
  };
    
  const handleDeleteGuest = async (eventId: string, guestId: string) => {
    await api.deleteGuestFromEvent(eventId, guestId);
    updateEventState(eventId, event => ({ ...event, guests: event.guests.filter(g => g.id !== guestId) }));
  };

  const handleAddTask = async (eventId: string, description: string) => {
    const newTask = await api.addTaskToEvent(eventId, { description });
    updateEventState(eventId, event => ({ ...event, tasks: [...event.tasks, newTask] }));
  };

  const handleToggleTask = async (eventId: string, taskId: string) => {
    await api.toggleTaskCompletion(eventId, taskId);
    updateEventState(eventId, event => ({ ...event, tasks: event.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }));
  };
    
  const handleDeleteTask = async (eventId: string, taskId: string) => {
    await api.deleteTaskFromEvent(eventId, taskId);
    updateEventState(eventId, event => ({ ...event, tasks: event.tasks.filter(t => t.id !== taskId) }));
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    await api.deleteEvent(eventId);
    setUserEvents(prev => prev.filter(e => e.id !== eventId));
  };
  
  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500"></div></div>
  }

  if (publicEventId) {
    return <PublicEventPage event={publicEventData} onRegister={handlePublicRegister} />;
  }

  if (!appStarted) return <LandingPage onStart={handleStartApp} />;
  
  if (!currentUser) return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} />;

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage userEvents={userEvents} onCreateEvent={() => handleOpenModal()} />;
      case 'Events':
        return <EventsPage userEvents={userEvents} currentUser={currentUser} onCreateEvent={() => handleOpenModal()} onDeleteEvent={handleDeleteEvent} onEditEvent={handleOpenModal} onOpenRegisterModal={handleOpenRegisterModal} />;
      case 'Calendar':
        return <CalendarPage userEvents={userEvents} onEditEvent={handleOpenModal} 
          eventHandlers={{
            onAddGuest: handleAddGuest, onUpdateGuestStatus: handleUpdateGuestStatus, onDeleteGuest: handleDeleteGuest,
            onAddTask: handleAddTask, onToggleTask: handleToggleTask, onDeleteTask: handleDeleteTask,
        }}
        />;
      case 'My Tickets':
        return <MyTicketsPage />;
      case 'AI Suggestions':
        return <AISuggestionsPage />;
      default:
        return <DashboardPage userEvents={userEvents} onCreateEvent={() => handleOpenModal()} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-300 flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search events..." className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-teal-500 text-white w-full sm:w-64" />
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors shadow">
                <PlusIcon className="w-5 h-5"/>
                Create Event
              </button>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-teal-400">
                {currentUser.name.substring(0,2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <EventFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />
       <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onRegister={handleConfirmRegistration}
        event={eventToRegister}
        isLoading={isRegistering}
      />
    </div>
  );
};

export default App;