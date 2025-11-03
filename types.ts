export enum RSVPStatus {
  Pending = "Pending",
  Attending = "Attending",
  Maybe = "Maybe",
  Declined = "Declined",
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  status: RSVPStatus;
}

export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface Event {
  id:string;
  name: string;
  date: string; // ISO string for date
  time: string; // "HH:MM" format
  location: string;
  description: string;
  guests: Guest[];
  tasks: Task[];
  userId: string;
  isPublic: boolean;
  userName?: string;
}

export interface ScrapedEvent {
  name: string;
  date: string;
  location: string;
  description: string;
}

// FIX: Added missing AISuggestions interface.
export interface AISuggestions {
  suggestedDescription: string;
  suggestedTasks: string[];
}
