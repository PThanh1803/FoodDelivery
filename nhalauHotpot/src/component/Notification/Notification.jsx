import { useEffect, useState , useContext} from 'react';
import { StoreContext } from '../../context/StoreContext';
import './Notification.css';
import { FaExclamationTriangle } from 'react-icons/fa';
import io from 'socket.io-client'; // Import Socket.IO client
import axios from 'axios';

const socket = io('http://localhost:4000'); // Connect to the Socket.IO server

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const {userInfo , url} = useContext(StoreContext);
  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/notification/user/${userInfo._id}`);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();

    // Listen for new notifications via Socket.IO
    socket.on('newNotification', (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    // Clean up on component unmount
    return () => {
      socket.off('newNotification');
    };
  }, []);

  // Filter notifications based on status and category
  useEffect(() => {
    // Filter notifications based on selected filters
    const filtered = notifications.filter(
      (notification) => 
        notification.type === 'admin' &&
        (statusFilter === 'all' || notification.status === statusFilter) &&
        (categoryFilter === 'all' || notification.category === categoryFilter)
    );
    setFilteredNotifications(filtered);
  }, [statusFilter, categoryFilter, notifications]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:4000/api/notification/${notificationId}/status`, { status: 'read' });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId ? { ...notification, status: 'read' } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
        <NotificationList notifications={filteredNotifications} markAsRead={markAsRead} />
      )}
    </div>
  );
};

const NotificationList = ({ notifications, markAsRead }) => {
  return (
    <ul className="notification-list">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          markAsRead={markAsRead}
        />
      ))}
    </ul>
  );
};

const NotificationItem = ({ notification, markAsRead }) => {
  const handleRead = () => {
    if (notification.status === 'unread') {
      markAsRead(notification._id);
    }
  };

  return (
    console.log(notification.status),
    <li className={`notification-item ${notification.status === 'unread' ? 'unread' : ''}`} onClick={handleRead}>
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
