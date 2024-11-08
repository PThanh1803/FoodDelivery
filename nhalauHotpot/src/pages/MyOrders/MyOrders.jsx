import React, { useEffect, useState, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token,userInfo } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);  // Trang hiện tại
    const limit = 5;  // Số đơn hàng mỗi trang
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchOrders = async () => {
        console.log(userInfo._id);
        console.log( `${url}/api/order/${userInfo._id}?page=${page}&limit=${limit}`);
        
        const response = await axios.get(
            `${url}/api/order/${userInfo._id}?page=${page}&limit=${limit}`,
            {
                headers: { token }                   }
        );
    
        if (!response.data.success) {
            console.log(response.data.message);
            alert(response.data.message);
            return;
        }
        
        setData(response.data.data);
        setTotalOrders(response.data.totalOrders);
        console.log(response.data.data);
    };
    

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token, page]);  // chạy lại khi page thay đổi

    const totalPages = Math.ceil(totalOrders / limit);  // Tổng số trang
    if(!data) return null;
    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className='container'>
                {data.map((order, index) => (
                    <div className="my-orders-order" key={index}>
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item, i) => (
                            <span key={i}>
                                {item.name} x {item.quantity}
                                {i < order.items.length - 1 ? ", " : ""}
                            </span>
                        ))}</p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}

                <div className="pagination">
                    <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                    <span>Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
