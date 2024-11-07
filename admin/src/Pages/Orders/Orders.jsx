/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userID, setUserID] = useState([])
  const ordersPerPage = 5; // Number of orders per page

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`);
    if (response.data.success) {
      setOrders(response.data.data);
      setFilteredOrders(response.data.data);
      // initialize with all orders
    } else {
      toast.error('Something went wrong, ERROR');
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      toast.success('Status updated');
      fetchAllOrders();
    } else {
      toast.error('Something went wrong, ERROR');
    }
  };

  useEffect(() => {
    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter Orders
  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by name
    if (nameFilter) {
      filtered = filtered.filter((order) =>
        `${order.address.firstName} ${order.address.lastName}`.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date); // Assuming order.date exists
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      });
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    filterOrders();
  }, [statusFilter, nameFilter, startDate, endDate, orders]); // Reapply filter when criteria changes

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status color mapping
  const getStatusColor = (status) => {
    if (status === 'Food processing') return 'red';
    if (status === 'Out for delivery') return 'yellow';
    if (status === 'Delivered') return 'green';
    return 'black';
  };


  return (  
    <div className="order ">
      <h1>Order Page</h1>


      {/* Filter Inputs */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Food processing">Food processing</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Order List */}
      <div className="order-list">
        {currentOrders.map((order, index) => {

          return (
            <div className="order-item" key={index}>
              <img src={assets.parcel_icon} alt="" />
              <div className="order-item-food">
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + ' x ' + item.quantity;
                    } else {
                      return item.name + ' x ' + item.quantity + ', ';
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + ' ' + order.address.lastName}
                </p>

                <div className="order-item-address">
                  <p>{order.address.street + ', '}</p>
                  <p>
                    {order.address.city +
                      ', ' +
                      order.address.state +
                      ', ' +
                      order.address.country +
                      ', ' +
                      order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>Total: ${order.amount}</p>
              <select
                style={{ backgroundColor: getStatusColor(order.status) }}
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food processing">Food processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders;
