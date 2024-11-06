// controllers/notificationController.js
import notificationModel from '../models/notificationModel.js';
// Controller to create a new notification
const createNotification = (io) => async (req, res) => {
    try {
      const notificationData = {
        userId: req.body.userId,
        userName: req.body.userName,
        userImage: req.body.userImage,
        type: req.body.type,
        category: req.body.category,
        message: req.body.message,
        details: req.body.details,
        status: req.body.status || 'unread'
      };
      const notification = new notificationModel(notificationData);
      await notification.save();
      
      io.emit('newNotification', notification);
      res.status(201).json(notification);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Controller to get notifications for a specific user
const getNotificationUser = async (req, res) => {
  try {

    const notifications = await notificationModel.find({ userId: req.params.userId, type: 'user' });

    if (!notifications) {
      return res.status(404).json({ success: false, message: 'Notifications not found' });
    }
    res.json({ success: true, message: 'Notifications fetched successfully', notifications: notifications});
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Controller to get all admin notifications
const getNotificationAdmin = async (req, res) => {
  try {
    const notifications = await notificationModel.find({ type: 'admin' });
    if (!notifications) {
      return res.status(404).json({ success: false, message: 'Notifications not found' });
    }
    res.json({ success: true, message: 'Notifications fetched successfully', notifications: notifications});
  } catch (err) {
    res.status(500).json({success: false, error: err.message });
  }
};

// Controller to update notification status (read/unread)
const updateNotificationStatus = async (req, res) => {
  try {
    const notification = await notificationModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification status updated', notification: notification});
  } catch (err) {
    res.status(500).json({success: false, error: err.message });
  }
};

export { createNotification, getNotificationUser, getNotificationAdmin, updateNotificationStatus };