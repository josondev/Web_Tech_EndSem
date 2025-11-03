import express from 'express';
import { 
    getEventsForUser, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    addGuest,
    updateGuestStatus,
    deleteGuest,
    addTask,
    toggleTask,
    deleteTask,
    getPublicEventById,
    publicRegisterToEvent,
    registerForScrapedEvent,
} from '../controllers/eventController';
import auth from '../middleware/auth';

const router = express.Router();

// Event routes
router.route('/').get(auth, getEventsForUser).post(auth, createEvent);
router.route('/:eventId').put(auth, updateEvent).delete(auth, deleteEvent);

// Public event routes
router.get('/public/:eventId', getPublicEventById);
router.post('/public/:eventId/register', publicRegisterToEvent);
router.post('/register-scraped', auth, registerForScrapedEvent);


// Guest routes
router.route('/:eventId/guests').post(auth, addGuest);
router.route('/:eventId/guests/:guestId').patch(auth, updateGuestStatus).delete(auth, deleteGuest);

// Task routes
router.route('/:eventId/tasks').post(auth, addTask);
router.route('/:eventId/tasks/:taskId').delete(auth, deleteTask);
router.route('/:eventId/tasks/:taskId/toggle').patch(auth, toggleTask);


export default router;
