import mongoose, { Document, Schema } from 'mongoose';

// Guest Subdocument Schema
const GuestSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Attending', 'Maybe', 'Declined'], default: 'Pending' },
});

// Task Subdocument Schema
const TaskSchema = new Schema({
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

export interface IEvent extends Document {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  guests: { id: string; name: string; email: string; status: string }[];
  tasks: { id: string; description: string; completed: boolean }[];
  userId: mongoose.Types.ObjectId;
  userName: string;
  isPublic: boolean;
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  guests: [GuestSchema],
  tasks: [TaskSchema],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
});

export default mongoose.model<IEvent>('Event', EventSchema);
