import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'


const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("Home");

    const { getTotalCartAmount, token, setToken } = React.useContext(StoreContext)

    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token")
        setToken("");
        navigate("/");
    }
    return (

        <div className="navbar">
            <Link to='/'>
                <img src={assets.logo} alt="logo" className='logo' />
            </Link>
            <ul className='navbar-menu'>
                <Link to="/" onClick={() => setMenu("Home")} className={menu === "Home" ? "Active" : ""}>Home</Link>
                <Link to="/menu" onClick={() => setMenu("Menu")} className={menu === "Menu" ? "Active" : ""} >Menu</Link>
                <Link to="/specialoffers" onClick={() => setMenu("SpecialOffers")} className={menu === "SpecialOffers" ? "Active" : ""} >Special Offers</Link>
                <Link to="/rate" onClick={() => setMenu("Rate")} className={menu === "Rate" ? "Active" : ""} >Rate</Link>
                {/* <a href='#explore-menu' onClick={()=>setMenu("Menu")} className={menu==="Menu" ? "Active" : ""} >Menu</a> */}
                {/* <a href='#app-download' onClick={() => setMenu("Order")} className={menu === "Order" ? "Active" : ""} >Mobile app</a>
                <a href='#footer' onClick={() => setMenu("Gift")} className={menu === "Gift" ? "Active" : ""} >Contact</a> */}
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
                                <img src={assets.profile_icon} alt="" />
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