/* eslint-disable react/display-name */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Notification.css';
import { FaExclamationTriangle } from 'react-icons/fa';
import io from 'socket.io-client'; // Import Socket.IO client
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const socket = io('http://localhost:4000'); // Connect to the Socket.IO server

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibleNotifications, setVisibleNotifications] = useState([]); // Initially visible notifications
  const [page, setPage] = useState(1); // Page to track the number of notifications loaded per scroll
  const observer = useRef();
  const navigate = useNavigate();

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/notification?type=admin');
        setNotifications(response.data.notifications);
        console.log("Notifications:", response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();

    // Listen for new notifications via Socket.IO
    socket.on('admin', (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    // Clean up on component unmount
    return () => {
      socket.off('admin');
    };
  }, []);

  // Update filtered notifications based on filters
  useEffect(() => {
    const filtered = notifications.filter(
      (notification) =>
        notification.type === 'admin' &&
        (statusFilter === 'all' || notification.status === statusFilter) &&
        (categoryFilter === 'all' || notification.category === categoryFilter)
    );
    setFilteredNotifications(filtered);
  }, [statusFilter, categoryFilter, notifications]);

  // Load more notifications on scroll
  useEffect(() => {
    const loadMoreNotifications = () => {
      const newVisibleNotifications = filteredNotifications.slice(0, page * 6);
      setVisibleNotifications(newVisibleNotifications);
    };
    loadMoreNotifications();
  }, [page, filteredNotifications]);

  // Observer callback for loading more notifications
  const lastNotificationRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleNotifications.length < filteredNotifications.length) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [filteredNotifications, visibleNotifications]);

  // Mark notification as read
  const markAsRead = async (notificationId, notification, type) => {
    if (type === 'unread') {
      try {
        await axios.put(`http://localhost:4000/api/notification/${notificationId}/status`, { status: 'read' });
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
      navigate('/orders', { state: { orderId: notification.details.orderId } });
      window.scrollTo(0, 0);
    } else if (notification.category === 'booking') {
      navigate('/reservation', { state: { bookingId: notification.details.bookingId } });
      window.scrollTo(0, 0);
    }
    else if (notification.category === 'review') {
      navigate('/review', { state: { reviewId: notification.details.reviewId } });
      window.scrollTo(0, 300);
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
          <option value="booking">Booking</option>
        </select>
      </div>
      {visibleNotifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <NotificationList 
          notifications={visibleNotifications} 
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
          ref={notifications.length === index + 1 ? lastNotificationRef : null} // Attach observer to the last notification
        />
      ))}
    </ul>
  );
};

const NotificationItem = React.forwardRef(({ notification, markAsRead }, ref) => {
  const handleRead = () => {   
    const type = notification.status === 'unread' ? 'unread' : 'read';
    markAsRead(notification._id, notification, type); 
   };

  return (
    <li
      ref={ref}
      className={`notification-item ${notification.status === 'unread' ? 'unread' : ''}`}
      onClick={handleRead}
    >
      <div className="notification-content">
        <div className="notification-user">
          <img src={notification.userImage} alt="user"></img>
          <h4>{notification.userName}</h4>
          
        </div>
       
        <p className="notification-message">{notification.message}</p>
        <p className="notification-details">Category: {notification.category}</p>
        <p className="notification-date">{new Date(notification.createdAt).toLocaleString()}</p>
      </div>
    </li>
  );
});

export default Notification;
