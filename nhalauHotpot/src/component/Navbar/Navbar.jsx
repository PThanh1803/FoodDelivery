import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'


const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("Home");

    const { getTotalCartAmount, token, setToken } = React.useContext(StoreContext)

    const navigate = useNavigate();
    const location = useLocation();
    const logout = () => {
        localStorage.removeItem("token")
        setToken("");
        navigate("/");
    }
    const getActiveClass = (path) => {
        if (path === "/") {
            return location.pathname === "/" ? "Active" : "";
        }
        return location.pathname.startsWith(path) ? "Active" : "";
    };
    return (

        <div className="navbar">
            <Link to='/'>

                <div className="navbar-logo">
                    <span>2T Food.</span>
                </div>
            </Link>
            <ul className='navbar-menu'>
                <ul className='navbar-menu'>
                    <Link to="/" className={getActiveClass("/")}>Home</Link>
                    <Link to="/menu" className={getActiveClass("/menu")}>Menu</Link>
                    <Link to="/promotions" className={getActiveClass("/promotions")}>Promotions</Link>
                    <Link to="/rate" className={getActiveClass("/rate")}>Rate</Link>
                    <Link to="/bookingtable" className={getActiveClass("/bookingtable")}>Booking Table</Link>
                </ul>


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

            </div>
        </div>
    )
}

export default Navbar