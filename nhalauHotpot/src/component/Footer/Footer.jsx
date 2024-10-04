// eslint-disable-next-line no-unused-vars
import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img className='footer-logo' src={assets.logo} alt=''/>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                     Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam vitae dolor vel fugit distinctio provident officia non dolorem quae, necessitatibus iste minima beatae aliquid quo sit voluptates. Unde, eum minus!
                </p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt=''/>
                    <img src={assets.linkedin_icon} alt=''/>
                    <img src={assets.twitter_icon} alt=''/>
                </div>
            </div>

            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91 1234567890</li>
                    <li>5Qp0S@example.com</li>
                </ul>
            </div>
        </div>
        <hr/>
        <div className="footer-copyright">
            <p>Copyright &copy; 2022. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer