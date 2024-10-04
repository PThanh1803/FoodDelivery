import React from 'react'
import './Orders.css'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react'
import {assets} from '../../assets/assets'

// eslint-disable-next-line react/prop-types
const Orders = ({url}) => {

  const [orders, setOrders] = React.useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`);
    if(response.data.success) {
      setOrders(response.data.data)
    }
    else {
      toast.error("Something went wrong, ERROR");
    }
  }

  const statusHandler = async (even,orderId) => {
    const response = await axios.post(`${url}/api/order/status`, { 
      orderId,
      status: even.target.value
    });
    if(response.data.success) {
      toast.success("Status updated");
      fetchAllOrders();
    }
    else {
      toast.error("Something went wrong, ERROR");
    }
  }

  useEffect(() => {
    fetchAllOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <div className='order add'>
        <h3>Order Page</h3>
        <div className='order-list'>
            {orders.map((order, index) => {
                return (
                    <div className='order-item' key={index}>
                        <img src={assets.parcel_icon} alt="" />
                        <div className="order-item-food">
                            <p className='order-item-food'>
                                {order.items.map((item, index) => {
                                    if(index === order.items.length - 1) {
                                        return item.name + " x " + item.quantity
                                    }else{
                                        return item.name + " x " + item.quantity + ", "
                                    }
                                })}
                            </p>
                            <p className='order-item-name'>
                              {order.address.firstName+ " "+order.address.lastName} 
                            </p>

                            <div className='order-item-address'>
                                <p>{order.address.sreet +", "}</p>
                                <p>{order.address.city +", " + order.address.state+", "+order.address.country +", "+order.address.zipcode}</p>
                            </div>
                            <p className='order-item-phone'>{order.address.phone}</p>
                        </div>
                        <p>Items : {order.items.length}</p>
                        <p>Total : ${order.amount}</p>
                        <select onChange={(event)=>{statusHandler(event,order._id)}}  value={order.status} >
                            <option value="Food processing">Food processing</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                )
            })}

        </div>

    </div>
  )
}

export default Orders