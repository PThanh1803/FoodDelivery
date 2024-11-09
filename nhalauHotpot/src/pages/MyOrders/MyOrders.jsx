import React, { useEffect, useState, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { useLocation } from 'react-router-dom';

const MyOrders = () => {
    const { url, token, userInfo } = useContext(StoreContext);
    const location = useLocation();
    const [data, setData] = useState([]);
    const [highlightedOrder, setHighlightedOrder] = useState(null);
    const [page, setPage] = useState(1);  // Trang hiện tại
    const limit = 5;  // Số đơn hàng mỗi trang
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchOrders = async () => {
        const response = await axios.get(
            `${url}/api/order/${userInfo._id}?page=${page}&limit=${limit}`,
            { headers: { token } }
        );

        if (!response.data.success) {
            console.log(response.data.message);
            alert(response.data.message);
            return;
        }
        
        setData(response.data.data);
        setTotalOrders(response.data.totalOrders);

        // Check if there is an order ID from the navigation state
        if (location.state && location.state.orderId) {
            const { orderId } = location.state;
            setHighlightedOrder(orderId);

            // Remove highlight after 6 seconds
            setTimeout(() => setHighlightedOrder(null), 4000);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token, page]);

    const totalPages = Math.ceil(totalOrders / limit);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div
                        className={`my-orders-order ${order._id === highlightedOrder ? 'highlight' : ''}`}
                        key={index}
                    >
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
