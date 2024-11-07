import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { FaBell ,FaExclamationTriangle} from "react-icons/fa";
import Notification from "../../Pages/Notification/Notification"; // Import Notification component
import { io } from "socket.io-client"; // Import Socket.IO client

const NotificationItem = ({ notification }) => {

  return (
    console.log(notification.status),
    <li className={`notification-item `} >
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

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false); // State to manage showing notifications
  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const [newNotification, setNewNotification] = useState(null); // State to hold a new notification for popup

  useEffect(() => {
    // Establish socket connection
    const socket = io("http://localhost:4000"); // Replace with your server URL
    
    socket.on('newNotification', (notification) => {
      // Add new notification to the list
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      setUnreadCount((prevCount) => prevCount + 1);

      // Show the notification popup
      setNewNotification(notification);
      setTimeout(() => {
        setNewNotification(null); // Hide the popup after 5 seconds
      }, 5000);
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications); // Toggle notification dropdown
  };

  return (
    <div className="navbar">
      <img src={assets.logo} className="logo" alt="Logo" />
      <div className="profile-image-container">
        <div className="notification-icon-container">
          <FaBell className="notification-icon" onClick={handleNotificationClick} />
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount}</span>
          )}
        </div>
        {showNotifications && 
          <div className="notification-dropdown"> 
            <Notification notifications={notifications}  />
          </div>} 
        <img src={assets.profile_image} className="profile-image" alt="Profile" />
      </div>

      {/* Pop-up notification for new unread notifications */}
      {newNotification && (
        <div className="notification-popup">
          <div className="popup-content">
            <NotificationItem notification={newNotification} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
