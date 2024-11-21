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
    const userId = searchParams.get("userId");
    const voucherId = searchParams.get("voucherId") || null;
    const discount = searchParams.get("discount") || null;
    console.log("voucherId", voucherId)
    console.log(success, orderId)

    const { url } = React.useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const response = await axios.post(`${url}/api/order/verify`, { success, orderId, userId, voucherId, discount });
        console.log(response);
        if (response.data.success) {
            alert(response.data.message)
            navigate("/myorders")
        }
        else {
            alert(response.data.message)
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