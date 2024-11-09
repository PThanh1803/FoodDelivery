import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaList, FaShoppingCart, FaTicketAlt, FaCogs, FaBell, FaSignOutAlt } from 'react-icons/fa';

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">

        <NavLink to='/add' className="sidebar-option"  >
          <FaPlus className="sidebar-icon" />
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

        <NavLink to='/dashboard' className="sidebar-option" >
          <FaCogs className="sidebar-icon" />
        </NavLink>

        <NavLink to='/notification' className="sidebar-option" >
          <FaBell className="sidebar-icon" />
        </NavLink>

        <NavLink to='/promotion' className="sidebar-option" >
          <FaSignOutAlt className="sidebar-icon" />
        </NavLink>

        <NavLink to='/reservation' className="sidebar-option" >
          <FaSignOutAlt className="sidebar-icon" />
        </NavLink>

        <NavLink to='/review' className="sidebar-option" >
          <FaSignOutAlt className="sidebar-icon" />
        </NavLink>
      </div>
    </div>
  );
};
