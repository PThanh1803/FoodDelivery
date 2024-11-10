import React, { useState, useEffect, useRef } from 'react';
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { FaBell, FaExclamationTriangle } from "react-icons/fa";
import Notification from "../../Pages/Notification/Notification";
import { io } from "socket.io-client";
import axios from "axios";
const NotificationItem = ({ notification, url }) => (
  <li
    className={`notification-item `}
  >
    <div className="notification-content">
      <div className="notification-user">
        <img src={`${url}/images/avatars/${notification.userImage}`} alt="user"></img>
        <h4>{notification.userName}</h4>

      </div>

      <p className="notification-message">{notification.message}</p>
      <p className="notification-details">Category: {notification.category}</p>
      <p className="notification-date">{new Date(notification.createdAt).toLocaleString()}</p>
    </div>
  </li>
);

const Navbar = ({ url }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(url + '/api/notification?type=admin');
        if (response.data.success) {
          setNotifications(response.data.notifications);
          setUnreadCount(response.data.notifications.filter(notification => notification.status === "unread").length);
        }
        else {
          console.log(response.data.message);
        }

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const socket = io(url);

    socket.on('admin', (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      setUnreadCount((prevCount) => prevCount + 1);

      setNewNotification(notification);
      setTimeout(() => setNewNotification(null), 5000);
    });

    socket.on('read', () => {
      setUnreadCount((prevCount) => prevCount - 1);
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
            <Notification url={url} />
          </div>
        )}
        <img src={assets.profile_image} className="profile-image" alt="Profile" />
      </div>

      {newNotification && (
        <div className="notification-popup">
          <div className="popup-content">
            <NotificationItem notification={newNotification} url={url} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
