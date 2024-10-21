import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { FaBell } from "react-icons/fa";
import Notification from "../../Pages/Notification/Notification"; // Import Notification component

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false); // State to manage showing notifications
  const [notifications, setNotifications] = useState([]); // State to hold notifications

  useEffect(() => {
    const fetchUnreadCount = () => {
      const count = 5; // Example: Hardcoded count for demonstration
      setUnreadCount(count);
    };

    const fetchNotifications = () => {
      // Replace with your logic to fetch notifications
      const fetchedNotifications = [
        { title: "New Booking", message: "You have a new booking.", date: "2024-10-15" },
        { title: "Order Update", message: "Your order has been shipped.", date: "2024-10-14" },
        { title: "Comment Reply", message: "Someone replied to your comment.", date: "2024-10-13" },
      ];
      setNotifications(fetchedNotifications);
    };

    fetchUnreadCount();
    fetchNotifications();
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications); // Toggle notification dropdown
  };

  return (
    <div className="navbar">
      <img src={assets.logo} className="logo" alt="Logo" />
      <div className="profile-image-container">
        <div className="notification-icon-container" >
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
    </div>
  );
};

export default Navbar;
