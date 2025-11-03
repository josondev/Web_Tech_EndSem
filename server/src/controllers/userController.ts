import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';


const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

export const signupUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.comparePassword(password))) {
      res.json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.json({ id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const checkUsersExist = async (req: Request, res: Response) => {
    try {
        const count = await User.countDocuments();
        res.json({ exists: count > 0 });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyTickets = async (req: AuthRequest, res: Response) => {
    try {
        const events = await Event.find({ 'guests.email': req.user.email });
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
