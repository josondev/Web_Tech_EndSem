import { Event, User, Guest, Task, RSVPStatus, ScrapedEvent, AISuggestions } from '../types';

// --- Real API Service ---

const BASE_URL = '/api'; // This would be your backend server URL

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper for making authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.reload();
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(errorData.message || 'API request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// --- User Authentication ---

export const signupUser = async (userData: Omit<User, 'id' | 'role'>): Promise<{ user?: User; token?: string; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.message || 'Signup failed.' };
    }
    localStorage.setItem('authToken', data.token);
    return { user: data.user, token: data.token };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const loginUser = async (credentials: Pick<User, 'email' | 'password'>): Promise<{ user?: User; token?: string; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.message || 'Invalid email or password.' };
    }
    localStorage.setItem('authToken', data.token);
    return { user: data.user, token: data.token };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;
    try {
        return await fetchWithAuth(`${BASE_URL}/users/me`);
    } catch (error) {
        console.error("Failed to fetch current user:", error);
        return null;
    }
};

export const getUsers = async(): Promise<User[]> => {
    return fetchWithAuth(`${BASE_URL}/users`);
}

export const checkUsersExist = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/users/exists`);
        const data = await response.json();
        return data.exists;
    } catch {
        return true; 
    }
};

// --- Event Management ---

export const getEventsForUser = async (): Promise<Event[]> => {
    return fetchWithAuth(`${BASE_URL}/events`);
};

export const getAllEvents = async (): Promise<Event[]> => {
    return fetchWithAuth(`${BASE_URL}/events/all`);
};

export const getMyTickets = async (): Promise<Event[]> => {
    return fetchWithAuth(`${BASE_URL}/users/me/tickets`);
};

export const getPublicEventById = async (eventId: string): Promise<Event> => {
    const response = await fetch(`${BASE_URL}/events/public/${eventId}`);
    if(!response.ok) throw new Error("Public event not found");
    return response.json();
}

export const saveEvent = async (eventData: Omit<Event, 'id' | 'guests' | 'tasks' | 'userId'> & { id?: string; guests?: Guest[]; tasks?: Task[] }): Promise<Event> => {
    if (eventData.id) {
        return fetchWithAuth(`${BASE_URL}/events/${eventData.id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
    } else {
        return fetchWithAuth(`${BASE_URL}/events`, {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    }
};

export const deleteEvent = async (eventId: string): Promise<{ success: boolean }> => {
    await fetchWithAuth(`${BASE_URL}/events/${eventId}`, { method: 'DELETE' });
    return { success: true };
};

export const registerForPublicEvent = async (eventData: ScrapedEvent): Promise<Event> => {
    return fetchWithAuth(`${BASE_URL}/events/register-scraped`, {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
};

// --- Guest & Task Management ---

export const addGuestToEvent = async (eventId: string, guestData: Omit<Guest, 'id'|'status'>): Promise<Guest> => {
    return fetchWithAuth(`${BASE_URL}/events/${eventId}/guests`, {
        method: 'POST',
        body: JSON.stringify(guestData),
    });
};

export const publicRegisterToEvent = async (eventId: string, guestData: Omit<Guest, 'id'|'status'>): Promise<Guest> => {
    const response = await fetch(`${BASE_URL}/events/public/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }
    return response.json();
};

export const updateGuestStatus = async (eventId: string, guestId: string, status: RSVPStatus): Promise<{ success: boolean }> => {
    await fetchWithAuth(`${BASE_URL}/events/${eventId}/guests/${guestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
    return { success: true };
};

export const deleteGuestFromEvent = async (eventId: string, guestId: string): Promise<{ success: boolean }> => {
    await fetchWithAuth(`${BASE_URL}/events/${eventId}/guests/${guestId}`, {
        method: 'DELETE',
    });
    return { success: true };
};

export const addTaskToEvent = async (eventId: string, taskData: Omit<Task, 'id'|'completed'>): Promise<Task> => {
    return fetchWithAuth(`${BASE_URL}/events/${eventId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(taskData),
    });
};

export const toggleTaskCompletion = async (eventId: string, taskId: string): Promise<{ success: boolean }> => {
    await fetchWithAuth(`${BASE_URL}/events/${eventId}/tasks/${taskId}/toggle`, {
        method: 'PATCH',
    });
    return { success: true };
};

export const deleteTaskFromEvent = async (eventId: string, taskId: string): Promise<{ success: boolean }> => {
    await fetchWithAuth(`${BASE_URL}/events/${eventId}/tasks/${taskId}`, {
        method: 'DELETE',
    });
    return { success: true };
};

// --- AI Service Proxies ---

export const getEventSuggestions = async (prompt: string): Promise<AISuggestions | null> => {
    try {
        return await fetchWithAuth(`${BASE_URL}/ai/suggestions`, {
            method: 'POST',
            body: JSON.stringify({ prompt }),
        });
    } catch (error) {
        console.error("Error fetching AI suggestions:", error);
        return null;
    }
};

export const scrapeEventsByLocation = async (locationQuery: string): Promise<ScrapedEvent[] | null> => {
    try {
        return await fetchWithAuth(`${BASE_URL}/ai/scrape-events`, {
            method: 'POST',
            body: JSON.stringify({ locationQuery }),
        });
    } catch (error) {
        console.error("Error scraping events:", error);
        return null;
    }
};