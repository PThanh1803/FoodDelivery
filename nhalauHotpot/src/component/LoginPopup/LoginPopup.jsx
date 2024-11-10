import React from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'

// eslint-disable-next-line react/prop-types
const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken, loginUser } = useContext(StoreContext)
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
            const response = await loginUser(data.email, data.password);
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
        else {
            newUrl = `${url}/api/user/register`;
            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setShowLogin(false);
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
                    {curentState !== "Login" && curentState !== "ForgotPassword" && (
                        <>
                            <input name="firstName" onChange={onChangeHandeler} value={data.firstName} type="text" placeholder="First Name" required />
                            <input name="lastName" onChange={onChangeHandeler} value={data.lastName} type="text" placeholder="Last Name" required />
                        </>
                    )}
                    <input name="email" onChange={onChangeHandeler} value={data.email} type="email" placeholder="Email" required />
                    {curentState !== "ForgotPassword" && (
                        <input name="password" onChange={onChangeHandeler} value={data.password} type="password" placeholder="Password" required />
                    )}


                    {curentState !== "Login" && curentState !== "ForgotPassword" && (
                        <input type="password" placeholder="Confirm Password" required />
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
                {curentState === "Login" ? (
                    <p>
                        Create a new account.
                        <span onClick={() => setCurrentState("SignUp")}>
                            &nbsp;Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Already have an account?
                        <span onClick={() => setCurrentState("Login")}>
                            &nbsp;Login here
                        </span>
                    </p>
                )}
            </form>
        </div>
    )
}

export default LoginPopup