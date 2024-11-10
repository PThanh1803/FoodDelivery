import React, { useState, useEffect, useRef } from 'react';
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { FaBell, FaExclamationTriangle } from "react-icons/fa";
import Notification from "../../Pages/Notification/Notification";
import { io } from "socket.io-client";

const NotificationItem = ({ notification }) => (
  <li className="notification-item">
    <div className="notification-content">
      <FaExclamationTriangle className="notification-icon" />
      <p className="notification-message">{notification.message}</p>
      <p className="notification-details">Category: {notification.category}</p>
      <p className="notification-date">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </div>
  </li>
);

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on('admin', (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      setUnreadCount((prevCount) => prevCount + 1);

      setNewNotification(notification);
      setTimeout(() => setNewNotification(null), 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        {showNotifications && (
          <div ref={dropdownRef} className="notification-dropdown">
            <Notification notifications={notifications} />
          </div>
        )}
        <img src={assets.profile_image} className="profile-image" alt="Profile" />
      </div>

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
