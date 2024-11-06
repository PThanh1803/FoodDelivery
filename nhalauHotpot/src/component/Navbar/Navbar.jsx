import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom"; // Giữ lại Link cho navigation
import { FaBell, FaExclamationTriangle } from "react-icons/fa";
import { io } from "socket.io-client"; // Import Socket.IO client
import { assets } from "../../assets/assets"; // Giữ lại assets
import Notification from "../Notification/Notification"; // Import Notification component
import "./Navbar.css";
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

const Navbar = ({ setShowLogin }) => {
  const [unreadCount, setUnreadCount] = useState(0); // Số lượng thông báo chưa đọc
  const [showNotifications, setShowNotifications] = useState(false); // Trạng thái để hiển thị dropdown thông báo
  const [notifications, setNotifications] = useState([]); // Lưu trữ các thông báo
  const [newNotification, setNewNotification] = useState(null); // Thông báo mới cho pop-up
  const [menu, setMenu] = useState("Home");

  const { getTotalCartAmount, token, setToken } =
    React.useContext(StoreContext);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  useEffect(() => {
    // Kết nối với Socket.IO server
    const socket = io("http://localhost:4000"); // Thay bằng URL của server bạn

    socket.on("newNotification", (notification) => {
      // Thêm thông báo mới vào danh sách
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
      setUnreadCount((prevCount) => prevCount + 1);

      // Hiển thị thông báo pop-up
      setNewNotification(notification);
      setTimeout(() => {
        setNewNotification(null); // Ẩn pop-up sau 5 giây
      }, 5000);
    });

    return () => {
      socket.disconnect(); // Ngắt kết nối khi component unmount
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications); // Toggling dropdown thông báo
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("Home")}
          className={menu === "Home" ? "Active" : ""}
        >
          Home
        </Link>
        <Link
          to="/menu"
          onClick={() => setMenu("Menu")}
          className={menu === "Menu" ? "Active" : ""}
        >
          Menu
        </Link>
        <Link
          to="/promotions"
          onClick={() => setMenu("Promotions")}
          className={menu === "Promotions" ? "Active" : ""}
        >
          Promotions
        </Link>
        <Link
          to="/rate"
          onClick={() => setMenu("Rate")}
          className={menu === "Rate" ? "Active" : ""}
        >
          Rate
        </Link>
        {/* <a href='#explore-menu' onClick={()=>setMenu("Menu")} className={menu==="Menu" ? "Active" : ""} >Menu</a> */}
        {/* <a href='#app-download' onClick={() => setMenu("Order")} className={menu === "Order" ? "Active" : ""} >Mobile app</a>
                <a href='#footer' onClick={() => setMenu("Gift")} className={menu === "Gift" ? "Active" : ""} >Contact</a> */}
        <Link
          to="/bookingtable"
          onClick={() => setMenu("Booking")}
          className={menu === "Booking" ? "Active" : ""}
        >
          Booking Table
        </Link>
      </ul>
        
      <div className='navbar-right'>
                <img src={assets.search_icon} alt="search" className='navbar-search-icon' />
                <div className='navbar-search-icon'>
                    <Link to='/card' >
                        <img src={assets.basket_icon} alt="basket" className='navbar-basket-icon' />
                    </Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? <button onClick={() => setShowLogin(true)}>Sign in</button> :
                    <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt="" />
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
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="" />
                                <p >Logout</p>
                            </li>
                        </ul>
                    </div>}
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
          <div className="notification-dropdown">
            <Notification notifications={notifications} />
          </div>
        )}
      </div>
            </div>
      

      {/* Pop-up thông báo cho các thông báo chưa đọc */}
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
