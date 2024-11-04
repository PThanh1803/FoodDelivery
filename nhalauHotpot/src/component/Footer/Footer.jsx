// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
const Footer = () => {
    const [menu, setMenu] = useState("Home");
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <span className="footer-logo">2T Food.</span>
                    <p> Website đặt món ăn từ nhà hàng 2T Food. ngon nhất Việt Nam
                    </p>
                    <p> Do 2 CEO trẻ đồng sáng lập
                        <br />
                        Nguyễn Hữu Thoại 21110663
                        <br />
                        Phạm Bá Thành 21110923
                    </p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt='' />
                        <img src={assets.linkedin_icon} alt='' />
                        <img src={assets.twitter_icon} alt='' />
                    </div>
                </div>

                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li><Link to="/" onClick={() => setMenu("Home")} className={menu === "Home" ? "Active" : ""}>Home</Link></li>
                        <li> <Link to="/menu" onClick={() => setMenu("Menu")} className={menu === "Menu" ? "Active" : ""} >Menu</Link></li>
                        <li> <Link to="/specialoffers" onClick={() => setMenu("SpecialOffers")} className={menu === "SpecialOffers" ? "Active" : ""} >Special Offers</Link></li>
                        <li> <Link to="/rate" onClick={() => setMenu("Rate")} className={menu === "Rate" ? "Active" : ""} >Rate</Link></li>
                    </ul>
                </div>

                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>Đại học Sư phạm kỹ thuật TP HCM</li>
                        <li>Khoa Công nghệ thông tin</li>
                    </ul>
                </div>
            </div>
            <hr />
            <div className="footer-copyright">
                <p>Copyright &copy; 2022. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer