import { Event, User, Guest, Task, RSVPStatus, ScrapedEvent } from '../types';

// --- Helper Functions for localStorage ---

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};

const simulateDelay = (delay = 400) => new Promise(res => setTimeout(res, delay));

// --- API Functions ---

const getUserById = (userId: string): User | undefined => {
    const users = getFromStorage<User[]>('users', []);
    return users.find(u => u.id === userId);
}

// --- User Authentication ---

export const signupUser = async (userData: Omit<User, 'id' | 'role'>): Promise<{ user?: User; error?: string }> => {
  await simulateDelay();
  const users = getFromStorage<User[]>('users', []);
  
  if (users.some(u => u.email === userData.email)) {
    return { error: "An account with this email already exists." };
  }
  
  const role = users.length === 0 ? 'admin' : 'user';
  const newUser: User = { ...userData, id: `user-${Date.now()}`, role };
  const updatedUsers = [...users, newUser];
  saveToStorage('users', updatedUsers);
  
  return { user: newUser };
};

export const loginUser = async (credentials: Pick<User, 'email' | 'password'>): Promise<{ user?: User; error?: string }> => {
  await simulateDelay();
  const users = getFromStorage<User[]>('users', []);
  
  if (users.length === 0) {
    return { error: "No accounts found. Please sign up." };
  }
  
  const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

  if (!user) {
    return { error: "Invalid email or password." };
  }

  return { user };
};

export const getUsers = async(): Promise<User[]> => {
    await simulateDelay(100);
    return getFromStorage<User[]>('users', []);
}


// --- Event Management ---

export const getEventsForUser = async (userId: string): Promise<Event[]> => {
    await simulateDelay();
    const allEvents = getFromStorage<Event[]>('events', []);
    return allEvents.filter(event => event.userId === userId);
};

export const getAllEvents = async (): Promise<Event[]> => {
    await simulateDelay();
    const allEvents = getFromStorage<Event[]>('events', []);
    const allUsers = getFromStorage<User[]>('users', []);
    const userMap = new Map(allUsers.map(u => [u.id, u.name]));
    
    return allEvents.map(event => ({
        ...event,
        userName: userMap.get(event.userId) || 'Unknown User'
    }));
}

export const saveEvent = async (eventData: Omit<Event, 'id' | 'guests' | 'tasks'> & { id?: string; guests?: Guest[]; tasks?: Task[] }): Promise<Event> => {
    await simulateDelay();
    const allEvents = getFromStorage<Event[]>('events', []);
    if (eventData.id) {
        // Update existing event
        let updatedEvent: Event | undefined;
        const updatedEvents = allEvents.map(e => {
            if (e.id === eventData.id) {
                updatedEvent = { ...e, ...eventData };
                return updatedEvent;
            }
            return e;
        });
        saveToStorage('events', updatedEvents);
        if (!updatedEvent) throw new Error("Event not found for update");
        return updatedEvent;
    } else {
        // Create new event
        const newEvent: Event = {
            ...eventData,
            id: `event-${Date.now()}`,
            guests: eventData.guests || [],
            tasks: eventData.tasks || [],
        };
        const updatedEvents = [...allEvents, newEvent];
        saveToStorage('events', updatedEvents);
        return newEvent;
    }
};

export const deleteEvent = async (eventId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    let allEvents = getFromStorage<Event[]>('events', []);
    allEvents = allEvents.filter(e => e.id !== eventId);
    saveToStorage('events', allEvents);
    return { success: true };
};

export const registerForPublicEvent = async (userId: string, eventData: ScrapedEvent): Promise<Event> => {
    const user = getUserById(userId);
    if (!user) {
        throw new Error("User not found for registration");
    }

    const newGuest: Guest = {
        id: `guest-${Date.now()}`,
        name: user.name,
        email: user.email,
        status: RSVPStatus.Attending,
    };

    const newEventForUser: Omit<Event, 'id'> = {
        name: eventData.name,
        date: new Date(eventData.date).toISOString().split('T')[0],
        time: "00:00",
        location: eventData.location,
        description: eventData.description,
        guests: [newGuest],
        tasks: [],
        userId: userId,
        isPublic: false,
    };
    
    return saveEvent(newEventForUser);
}

// --- Guest & Task Management (within an event) ---

const updateEventInStorage = (eventId: string, updateFn: (event: Event) => Event): Event | null => {
    const allEvents = getFromStorage<Event[]>('events', []);
    let updatedEvent: Event | null = null;
    const updatedEvents = allEvents.map(e => {
        if (e.id === eventId) {
            updatedEvent = updateFn(e);
            return updatedEvent;
        }
        return e;
    });
    if (updatedEvent) {
        saveToStorage('events', updatedEvents);
    }
    return updatedEvent;
}

export const addGuestToEvent = async (eventId: string, guestData: Omit<Guest, 'id'|'status'>): Promise<Guest> => {
    await simulateDelay();
    const newGuest: Guest = { ...guestData, id: `guest-${Date.now()}`, status: RSVPStatus.Pending };
    const updatedEvent = updateEventInStorage(eventId, event => ({
        ...event,
        guests: [...event.guests, newGuest]
    }));
    if (!updatedEvent) throw new Error("Event not found to add guest");
    return newGuest;
};

export const publicRegisterToEvent = async (eventId: string, guestData: Omit<Guest, 'id'|'status'>): Promise<Guest> => {
    await simulateDelay();
    const newGuest: Guest = { ...guestData, id: `guest-${Date.now()}`, status: RSVPStatus.Attending };
    const updatedEvent = updateEventInStorage(eventId, event => ({
        ...event,
        guests: [...event.guests, newGuest]
    }));
    if (!updatedEvent) throw new Error("Event not found to register guest");
    return newGuest;
};


export const updateGuestStatus = async (eventId: string, guestId: string, status: RSVPStatus): Promise<{ success: boolean }> => {
    await simulateDelay();
    updateEventInStorage(eventId, event => ({
        ...event,
        guests: event.guests.map(g => g.id === guestId ? { ...g, status } : g)
    }));
    return { success: true };
};

export const deleteGuestFromEvent = async (eventId: string, guestId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    updateEventInStorage(eventId, event => ({
        ...event,
        guests: event.guests.filter(g => g.id !== guestId)
    }));
    return { success: true };
};

export const addTaskToEvent = async (eventId: string, taskData: Omit<Task, 'id'|'completed'>): Promise<Task> => {
    await simulateDelay();
    const newTask: Task = { ...taskData, id: `task-${Date.now()}`, completed: false };
    updateEventInStorage(eventId, event => ({
        ...event,
        tasks: [...event.tasks, newTask]
    }));
    return newTask;
};

export const toggleTaskCompletion = async (eventId: string, taskId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    updateEventInStorage(eventId, event => ({
        ...event,
        tasks: event.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
    return { success: true };
};

export const deleteTaskFromEvent = async (eventId: string, taskId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    updateEventInStorage(eventId, event => ({
        ...event,
        tasks: event.tasks.filter(t => t.id !== taskId)
    }));
    return { success: true };
};