// routes/notificationRoutes.js
import express from 'express';
import {
  getNotificationUser,
  getNotificationAdmin,
  createNotification,
  updateNotificationStatus
} from '../controller/notificationController.js';

const notificationRouter = (io) => {
  const router = express.Router();

  router.get('/user/:userId', getNotificationUser);
  router.get('/admin', getNotificationAdmin);
  router.post('/', createNotification(io)); // Pass io here
  router.patch('/:id/status', updateNotificationStatus);

  return router;
};

export default notificationRouter;
