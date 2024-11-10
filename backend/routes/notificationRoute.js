// routes/notificationRoutes.js
import express from 'express';
import {
  getNotifications,
  updateNotificationStatus
} from '../controller/notificationController.js';

    const notificationRouter = express.Router();

    notificationRouter.get('/:userId?', getNotifications); // Optional userId parameter
    notificationRouter.put('/:id/status', updateNotificationStatus);


export default notificationRouter;
