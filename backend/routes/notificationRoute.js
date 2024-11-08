// routes/notificationRoutes.js
import express from 'express';
import {
  getNotifications,
  createNotification,
  updateNotificationStatus
} from '../controller/notificationController.js';

const notificationRouter = (io) => {
  const router = express.Router();

  router.get('/:userId?', getNotifications); // Optional userId parameter
  router.post('/', createNotification(io));   // Pass io here
  router.put('/:id/status', updateNotificationStatus);

  return router;
};

export default notificationRouter;
