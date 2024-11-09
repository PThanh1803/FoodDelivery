import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './Notification.css';
import { FaExclamationTriangle } from 'react-icons/fa';
import io from 'socket.io-client';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const socket = io('http://localhost:4000'); // Connect to the Socket.IO server

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Tracks if there are more notifications to load
  const { userInfo, url } = useContext(StoreContext);
  const observer = useRef();
  const navigate = useNavigate();
  
  // Fetch notifications with pagination
  const fetchNotifications = async (page) => {
    try {
      console.log(`${url}/api/notification/${userInfo._id}?type=user&page=${page}`)
      const response = await axios.get(`${url}/api/notification/${userInfo._id}?type=user&page=${page}`);
      const newNotifications = response.data.notifications;
      setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
      setHasMore(newNotifications.length >= 4); // Set hasMore to false if fewer than the limit are returned
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Initial fetch and socket setup
  useEffect(() => {
    fetchNotifications(page);

    // Listen for new notifications via Socket.IO
    socket.on('newNotification', (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    // Clean up on component unmount
    return () => {
      socket.off('newNotification');
    };
  }, [page, url, userInfo._id]);

  // Load more notifications on scroll
  useEffect(() => {
    if (page > 1) fetchNotifications(page);
  }, [page]);

  // Observer callback for loading more notifications
  const lastNotificationRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  // Filter notifications based on status and category
  useEffect(() => {
    const filtered = notifications.filter(
      (notification) =>
        (statusFilter === 'all' || notification.status === statusFilter) &&
        (categoryFilter === 'all' || notification.category === categoryFilter)
    );
    setFilteredNotifications(filtered);
  }, [statusFilter, categoryFilter, notifications]);

  // Mark notification as read
  const markAsRead = async (notificationId ,notification, type) => {
      if (type === 'unread') {
      try {
        await axios.put(`${url}/api/notification/${notificationId}/status`, { status: 'read' });
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId ? { ...notification, status: 'read' } : notification
          )
        );         
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    if (notification.category === 'order') {
      navigate('/myorders', { state: { orderId: notification.details.orderId } });
    } else if (notification.category === 'booking') {
      navigate('/mybookings', { state: { bookingId: notification.details.bookingId } });
    }
    
  };

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      <div className="filter-container">
        <button onClick={() => setStatusFilter('all')}>All</button>
        <button onClick={() => setStatusFilter('unread')}>Unread</button>
        <button onClick={() => setStatusFilter('read')}>Read</button>
        <select onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="review">Review</option>
          <option value="order">Order</option>
          <option value="comment">Comment</option>
        </select>
      </div>
      {filteredNotifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <NotificationList 
          notifications={filteredNotifications} 
          markAsRead={markAsRead} 
          lastNotificationRef={lastNotificationRef} 
        />
      )}
    </div>
  );
};

const NotificationList = ({ notifications, markAsRead, lastNotificationRef }) => {
  return (
    <ul className="notification-list">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          markAsRead={markAsRead}
          ref={notifications.length === index + 1 ? lastNotificationRef : null}
        />
      ))}
    </ul>
  );
};

const NotificationItem = React.forwardRef(({ notification, markAsRead }, ref) => {
  const handleRead = () => {
    
    const type = notification.status === 'unread' ? 'unread' : 'read';
    markAsRead(notification._id, notification, type);  };
  return (
    <li
      ref={ref}
      className={`notification-item ${notification.status === 'unread' ? 'unread' : ''}`}
      onClick={handleRead}
    >
      <div className="notification-content">
        <FaExclamationTriangle className="notification-icon" />
        <p className="notification-message">{notification.message}</p>
        <p className="notification-details">Category: {notification.category}</p>
        <p className="notification-date">{new Date(notification.createdAt).toLocaleString()}</p>
      </div>
    </li>
  );
});

export default Notification;
