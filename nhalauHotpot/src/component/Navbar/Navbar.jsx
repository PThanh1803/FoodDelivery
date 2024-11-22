import React, { useState, useEffect, useContext, useRef } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaExclamationTriangle } from "react-icons/fa";
import { io } from "socket.io-client";
import { assets } from "../../assets/assets";
import Notification from "../Notification/Notification";
import "./Navbar.css";
import calendar from "../../assets/calendar-solid-24.png";
import axios from "axios";

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

const Navbar = ({ setShowLogin }) => {

  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { getTotalCartAmount, token, setToken, userInfo, url } = useContext(StoreContext);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null); 
  const dropdownRef2 = useRef(null); // Reference for the dropdown

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const getActiveClass = (path) => {
    if (path === "/") {
      return location.pathname === "/" ? "Active" : "";
    }
    return location.pathname.startsWith(path) ? "Active" : "";
  };
  useEffect(() => {
    const fetchNotifications = async () => {
      if (token) {
        try {
          const response = await axios.get(`${url}/api/notification/${userInfo._id}?type=user`);
          setNotifications(response.data.notifications);
          setUnreadCount(response.data.notifications.filter(notification => notification.status === "unread").length);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }

    };

    fetchNotifications();
  }, [userInfo._id, url]);

  useEffect(() => {
    if (!userInfo?._id) return;
    // Set up the WebSocket connection
    const socket = io("http://localhost:4000");

    // Listen for new notifications on the socket
    socket.on(`${userInfo._id}`, (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setNewNotification(notification);

      // Remove the new notification alert after 5 seconds
      setTimeout(() => setNewNotification(null), 5000);
    });

    socket.on("read", (notification) => {
      setUnreadCount((prev) => prev - 1);
    });
    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [userInfo?._id, url]);



  useEffect(() => {
    const handleClickOutside = (event) => {
      // Đóng dropdown notifications nếu click ra ngoài
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
  
      // Đóng profile dropdown nếu click ra ngoài
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  const handleNotificationClick = () => setShowNotifications((prev) => !prev);
  const handleDropdownClick = () => setShowDropdown((prev) => !prev);
  return (
    <div className="navbar">
      <Link to="/">
        <div className="navbar-logo"><span>2T Food.</span></div>
      </Link>
      <ul className="navbar-menu">
        <Link to="/" className={getActiveClass("/")}>Home</Link>
        <Link to="/menu" className={getActiveClass("/menu")}>Menu</Link>
        <Link to="/promotions" className={getActiveClass("/promotions")}>Promotions</Link>
        <Link to="/rate" className={getActiveClass("/rate")}>Rate</Link>
        <Link to="/bookingtable" className={getActiveClass("/bookingtable")}>Booking Table</Link>
        <Link to="/vouchers" className={getActiveClass("/vouchers")}>Voucher Hot</Link>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to="/card">
            <img src={assets.basket_icon} alt="basket" className="navbar-basket-icon" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        <div className="profile-image-container">
          <div className="notification-icon-container">
            <FaBell
              className="notification-icon"
              onClick={handleNotificationClick}
            />
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </div>

          {showNotifications && (
            <div ref={dropdownRef} className="notification-dropdown">
              <Notification notifications={notifications} />
            </div>
          )}
        </div>
        {!token ? <button className="navbar-signin" onClick={() => setShowLogin(true)}>Sign in</button> :
          <div className='navbar-profile' ref={dropdownRef2}>
            <img src={`http://localhost:4000/images/avatars/${userInfo.avatar}`} alt={userInfo.name} className='navbar-profile-image'  
              onClick={handleDropdownClick}/>
            {showDropdown &&
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={() => navigate("/myprofile")}>
                <img src={assets.profile_icon_regular} alt="" />
                <p>Profile</p>
              </li>
              <hr />
              <li onClick={() => navigate("/mybookings")}>
                <img src={calendar} alt="" />
                <p>My Booking</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>}

          </div>
        }
        
      </div>

      {newNotification && (
        <div className="notification-popup">
          <div className="notification-content">
            <NotificationItem notification={newNotification} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
