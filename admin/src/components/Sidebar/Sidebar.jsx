import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaList, FaShoppingCart, FaTicketAlt, FaCogs, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard, MdOutlineRateReview } from "react-icons/md";
import { AiOutlineGift } from "react-icons/ai";
import { MdTableRestaurant } from "react-icons/md";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to='/dashboard' className="sidebar-option" >
          <MdDashboard className="sidebar-icon" />
        </NavLink>

        <NavLink to='/list' className="sidebar-option"  >
          <FaList className="sidebar-icon" />
        </NavLink>

        <NavLink to='/orders' className="sidebar-option" >
          <FaShoppingCart className="sidebar-icon" />
        </NavLink>

        <NavLink to='/voucher' className="sidebar-option" >
          <FaTicketAlt className="sidebar-icon" />
        </NavLink>

        <NavLink to='/promotion' className="sidebar-option" >
          <AiOutlineGift className="sidebar-icon" />
        </NavLink>

        <NavLink to='/reservation' className="sidebar-option" >
          <MdTableRestaurant className="sidebar-icon" />
        </NavLink>

        <NavLink to='/review' className="sidebar-option" >
          <MdOutlineRateReview className="sidebar-icon" />
        </NavLink>
      </div>
    </div>
  );
};
