import React from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

// eslint-disable-next-line react/prop-types
const LoginPopup = () => {
    const { url, setToken, loginAdmin } = useContext(StoreContext)
    const [curentState, setCurrentState] = React.useState("Login")
    const [data, setData] = React.useState({
        name: '',
        email: '',
        password: '',
    })

    const onChangeHandeler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if (curentState === "Login") {
            // Gọi hàm loginUser để xử lý đăng nhập
            const response = await loginAdmin(data.email, data.password);
            if (response.success) {
                setShowLogin(false);
            } else {
                alert(response.message);
            }
        }
        else if (curentState === "ForgotPassword") {
            const response = await axios.post(`${url}/api/email/password`, { email: data.email });
            if (response.data.success) {
                alert("Check your email for password reset instructions.");
                setCurrentState("Login");
            } else {
                alert(response.data.message);
            }
        }
    }


    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{curentState === "ForgotPassword" ? "Forgot Password" : curentState}</h2>
                    <img
                        src={assets.cross_icon}
                        onClick={() => setShowLogin(false)}
                        className="close" alt=""
                    />
                </div>

                <div className="login-popup-inputs">
                    <input name="email" onChange={onChangeHandeler} value={data.email} type="email" placeholder="Email" required />
                    {curentState !== "ForgotPassword" && (
                        <input name="password" onChange={onChangeHandeler} value={data.password} type="password" placeholder="Password" required />
                    )}
                    <button type="submit">
                        {curentState === "SignUp" ? "Create Account" : curentState === "ForgotPassword" ? "Send Reset Link" : "Login"}
                    </button>
                </div>


                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By creating an account, you agree to our <span>Terms and conditions</span></p>
                </div>
                {curentState === "Login" && (
                    <p>
                        Forgot your password?
                        <span onClick={() => setCurrentState("ForgotPassword")}>
                            &nbsp;Click here
                        </span>
                    </p>
                )}
            </form>
        </div>
    )
}

export default LoginPopup