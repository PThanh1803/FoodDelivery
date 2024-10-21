/* eslint-disable react/prop-types */
// Notification.js
import  { useEffect, useState } from 'react';
import './Notification.css';
import { FaExclamationTriangle } from 'react-icons/fa'; // Import icon for alerts

const Notification = () => {
  const notifications = [
    {
      _id: 'notification_id_1',
      userId: 'admin_id_1',
      type: 'admin',
      category: 'booking',
      message: 'A new booking has been made.',
      createdAt: '2024-10-14T12:30:00Z',
      status: 'unread',
      details: { bookingId: 'booking_id_1' }
    },
    {
      _id: 'notification_id_2',
      userId: 'admin_id_2',
      type: 'admin',
      category: 'order',
      message: 'A new order has been placed.',
      createdAt: '2024-10-14T12:30:00Z',
      status: 'read',
      details: { orderId: 'order_id_1' }
    },
    {
      _id: 'notification_id_3',
      userId: 'admin_id_3',
      type: 'admin',
      category: 'comment',
      message: 'A new comment has been posted.',
      createdAt: '2024-10-14T12:30:00Z',
      status: 'unread',
      details: { commentId: 'comment_id_1' }
    }
  ];

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // All, unread, or read
  const [categoryFilter, setCategoryFilter] = useState('all'); // All or specific categories

  useEffect(() => {
    // Lọc thông báo của admin theo trạng thái và danh mục
    const adminNotifications = notifications.filter(
      (notification) => notification.type === 'admin' &&
        (statusFilter === 'all' || notification.status === statusFilter) &&
        (categoryFilter === 'all' || notification.category === categoryFilter)
    );
    setFilteredNotifications(adminNotifications);
  }, [statusFilter, categoryFilter]);

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      <div className="filter-container">
        <button onClick={() => setStatusFilter('all')}>All</button>
        <button onClick={() => setStatusFilter('unread')}>Unread</button>
        <button onClick={() => setStatusFilter('read')}>Read</button>
        <select onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="booking">Booking</option>
          <option value="order">Order</option>
          <option value="comment">Comment</option>
        </select>
      </div>
      {filteredNotifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <NotificationList notifications={filteredNotifications} />
      )}
    </div>
  );
};

const NotificationList = ({ notifications }) => {
  return (
    <ul className="notification-list">
      {notifications.map((notification) => (
        <NotificationItem key={notification._id} notification={notification} />
      ))}
    </ul>
  );
};

const NotificationItem = ({ notification }) => {
  return (
    <li className="notification-item">
      <div className="notification-content">
        <FaExclamationTriangle className="notification-icon" />
        <p className="notification-message">{notification.message}</p>
        <p className="notification-details">
          Category: {notification.category}
        </p>
        <p className="notification-date">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
    </li>
  );
};

export default Notification;
