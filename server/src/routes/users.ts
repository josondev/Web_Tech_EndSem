import express from 'express';
import { signupUser, loginUser, getCurrentUser, checkUsersExist, getMyTickets } from '../controllers/userController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/exists', checkUsersExist);
router.get('/me', auth, getCurrentUser);
router.get('/me/tickets', auth, getMyTickets);

export default router;
