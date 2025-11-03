import express from 'express';
import { getEventSuggestions, scrapeEventsByLocation } from '../controllers/aiController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/suggestions', auth, getEventSuggestions);
router.post('/scrape-events', auth, scrapeEventsByLocation);

export default router;
