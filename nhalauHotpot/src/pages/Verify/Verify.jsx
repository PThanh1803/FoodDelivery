/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import './Verify.css'
import { useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Verify = () => {

    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    console.log(success, orderId)

    const {url} = React.useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const response = await axios.post(`${url}/api/order/verify`, {success, orderId})
        console.log(response);
        if(response.data.success){
            navigate("/myorders")
        }
        else{
           navigate("/")
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [])

  return (
    <div className="verify">
        <div className="spinner">

        </div>

    </div>
  )
}

export default Verify