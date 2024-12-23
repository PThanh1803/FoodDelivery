/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./DashBoard.css";
import axios from "axios";

const DashBoard = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDishes, setTotalDishes] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [mostOrderedItems, setMostOrderedItems] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/order/`);
      if (response.data.success) {
        const ordersData = response.data.data;
        const filteredOrders = ordersData.filter(order => {
          const orderDate = new Date(order.date).toISOString().split("T")[0];
          return orderDate >= startDate && orderDate <= endDate;
        });

        setOrders(filteredOrders);

        let revenue = 0;
        const itemCount = {};
        let totalDishesCount = 0;
        const customersSet = new Set();

        filteredOrders.forEach((order) => {
          revenue += order.amount;
          customersSet.add(order.userId);
          totalDishesCount += order.items.reduce((sum, item) => sum + item.quantity, 0);

          order.items.forEach((item) => {
            if (!itemCount[item.name]) {
              itemCount[item.name] = { quantity: 0, image: item.image };
            }
            itemCount[item.name].quantity += item.quantity;
          });
        });

        setTotalRevenue(revenue);
        setTotalDishes(totalDishesCount);
        setTotalCustomers(customersSet.size);

        const mostOrdered = Object.entries(itemCount)
          .sort((a, b) => b[1].quantity - a[1].quantity)
          .slice(0, 3);
        setMostOrderedItems(mostOrdered);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calculate orders to display for the current page
  const displayedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-right">
        <h1>Dashboard</h1>

        <div className="input-container">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field"
          />
        </div>

        <h3>{`From: ${new Date(startDate).toLocaleDateString()} - To: ${new Date(endDate).toLocaleDateString()}`}</h3>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <p>Total Revenue</p>
            <h3>${totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="dashboard-card">
            <p>Total Dishes Ordered</p>
            <h3>{totalDishes}</h3>
          </div>
          <div className="dashboard-card">
            <p>Total Customers</p>
            <h3>{totalCustomers}</h3>
          </div>
        </div>

        <div className="order-report">
          <div className="order-header">
            <h3>Order Report</h3>
          </div>

          <div className="order-table">
            <div className="order-table-header">
              <p className="customer-name">Customer</p>
              <p className="food-name">Menu</p>
              <p className="food-price">Total Payment</p>
              <p className="order-status">Status</p>
            </div>

            <div className="order-list">
              {displayedOrders.map((order, index) => (
                <div className="order-item" key={index}>
                  <p className="customer-name">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="food-name">
                    {order.items.map((item) => item.name).join(", ")}
                  </p>
                  <p className="food-price">${order.amount}</p>
                  <p className="order-status">
                    <span className={`status ${order.status.toLowerCase().replace(/\s+/g, '')}`}>
                      {order.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="most-ordered">
        <h3>Most Ordered Items</h3>
        {mostOrderedItems.map(([name, data], index) => (
          <div key={index} className="most-ordered-item">
            <img src={`${url}/images/${data.image}`} alt={name} />
            <p>{name}</p>
            <p>{data.quantity} ordered</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoard;
