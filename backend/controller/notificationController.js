// controllers/notificationController.js
import notificationModel from '../models/notificationModel.js';

// Controller to create a new notification
const createNotification = async (io, notificationData) => {
  try {
      const notification = new notificationModel(notificationData);

      await notification.save();
      console.log("Notification created:", notification);
      if(notification.type === 'admin') {
        io.emit('admin', notification);
      }
      else if(notification.type === 'user') {
        io.emit(`${notification.userId}`, notification);
      }
      
  } catch (err) {
      console.error("Error creating notification:", err.message);
  }
};


// Combined controller to get notifications based on type and user ID
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, page = 1,limit = 6 } = req.query;
    const skip = (page - 1) * limit;
    const filter = { type };
    if (userId) {
      filter.userId = userId;
    }

    const notifications = await notificationModel
      .find(filter)
      .skip(skip)
      .sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ success: false, message: 'Notifications not found' });
    }

    res.json({ success: true, message: 'Notifications fetched successfully', notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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
    res.json({ success: true, message: 'Notification status updated', notification });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export { createNotification, getNotifications, updateNotificationStatus };
