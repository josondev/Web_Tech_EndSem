import { Response } from 'express';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';

// --- Event Controllers ---

export const getEventsForUser = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ userId: req.user._id });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, date, time, location, description, tasks, isPublic } = req.body;
    const event = new Event({
      name,
      date,
      time,
      location,
      description,
      tasks: tasks || [],
      isPublic,
      userId: req.user._id,
      userName: req.user.name,
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const { name, date, time, location, description, isPublic } = req.body;
        event.name = name || event.name;
        event.date = date || event.date;
        event.time = time || event.time;
        event.location = location || event.location;
        event.description = description || event.description;
        event.isPublic = isPublic === undefined ? event.isPublic : isPublic;
        
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await event.deleteOne();
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// --- Public Event Controllers ---

export const getPublicEventById = async (req: AuthRequest, res: Response) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event || !event.isPublic) {
            return res.status(404).json({ message: 'Public event not found' });
        }
        res.json(event);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const publicRegisterToEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email } = req.body;
        const event = await Event.findById(req.params.eventId);

        if (!event || !event.isPublic) {
            return res.status(404).json({ message: 'Event not found or is not public' });
        }
        
        const existingGuest = event.guests.find(guest => guest.email === email);
        if (existingGuest) {
            return res.status(400).json({ message: 'This email is already registered for the event.' });
        }

        const newGuest = { name, email, status: 'Attending' };
        event.guests.push(newGuest);
        await event.save();
        
        res.status(201).json(event.guests[event.guests.length - 1]);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const registerForScrapedEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { name, date, location, description } = req.body;
        const newEvent = new Event({
            name,
            date,
            location,
            description,
            time: "12:00", // Default time
            isPublic: false,
            userId: req.user.id,
            userName: req.user.name,
            guests: [{
                name: req.user.name,
                email: req.user.email,
                status: 'Attending'
            }],
            tasks: []
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// --- Guest Controllers ---

export const addGuest = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const guest = { name, email, status: 'Pending' };
    event.guests.push(guest);
    await event.save();
    res.status(201).json(event.guests[event.guests.length - 1]);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGuestStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId, guestId } = req.params;
        const { status } = req.body;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const guest = event.guests.id(guestId);
        if (!guest) return res.status(404).json({ message: 'Guest not found' });
        
        guest.status = status;
        await event.save();
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteGuest = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId, guestId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const guest = event.guests.id(guestId);
        if (!guest) return res.status(404).json({ message: 'Guest not found' });

        await guest.deleteOne();
        await event.save();
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// --- Task Controllers ---

export const addTask = async (req: AuthRequest, res: Response) => {
  try {
    const { description } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const task = { description, completed: false };
    event.tasks.push(task);
    await event.save();
    res.status(201).json(event.tasks[event.tasks.length - 1]);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId, taskId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        
        const task = event.tasks.id(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.completed = !task.completed;
        await event.save();
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId, taskId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const task = event.tasks.id(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        await task.deleteOne();
        await event.save();
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
