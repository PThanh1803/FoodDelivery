// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },  // New field
  userImage: { type: String },                 // New field
  type: { type: String, enum: ['admin', 'user'], required: true },
  category: { type: String, enum: ['booking', 'order', 'review'], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  details: { type: Object }
});

const notificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default notificationModel;