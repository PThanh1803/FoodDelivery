import React from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'

// eslint-disable-next-line react/prop-types
const LoginPopup = ({setShowLogin}) => {
    const {url, setToken} = useContext(StoreContext)
    const [curentState,setCurrentState] = React.useState("Login")
    const [data,setData] = React.useState({
        name:'',
        email:'',
        password:'',
    })

    const onChangeHandeler = (event)=>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const onLogin = async (event)=>{
        event.preventDefault();
        let newUrl = url;
        if (curentState==="Login"){
            newUrl = `${url}/api/user/login`
        }else{
            newUrl = `${url}/api/user/register`
        }

        const respone = await axios.post(newUrl,data)

        if(respone.data.success){
            setToken (respone.data.token);
            console.log(respone.data.token);
            localStorage.setItem("token", respone.data.token);
            setShowLogin(false)
        }
        else{
            alert(respone.data.message);    
    }
    }

    
  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{curentState}</h2>
                <img 
                    src={assets.cross_icon} 
                    onClick={() => setShowLogin(false)} 
                    className="close" alt="" 
                />
            </div>

            <div className="login-popup-inputs">
                {curentState==="Login"?<> </> : <input name="name" onChange={onChangeHandeler} value={data.name} type="text" placeholder="Name" required />}
                <input name="email" onChange={onChangeHandeler} value={data.email} type="email" placeholder="Email" required />
                <input name="password" onChange={onChangeHandeler} value={data.password} type="password" placeholder="Password" required />
                {curentState==="Login"?<> </> : <input type="password" placeholder="Confirm Password" required  />}
                < button type="submit">{curentState==="Sign Up" ? "Create Account" : "Login"}</button>
            </div>

           
            <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>By creating an account, you agree to our <span>Terms and conditions</span></p>
            </div>
            {curentState==="Login"
                ?<p>
                    Create a new account. 
                    <span  onClick={() => setCurrentState("Sign Up")}>
                        &nbsp;Click here   
                    </span>
                </p>: 
                <p>
                    Already have an account? 
                    <span onClick={() => setCurrentState("Login")}>
                        &nbsp;Login here
                    </span>
                </p>
            
            }
        </form>
    </div>
  )
}

export default LoginPopup