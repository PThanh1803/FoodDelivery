import React, { useState, useEffect, useContext } from 'react';
import './Reservation.css';
import { FaPhone, FaEnvelope, FaCheckCircle, FaClock, FaUserFriends } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const Reservation = ({ url }) => {
  const [reservations, setReservations] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;


  // Fetch reservations from the backend
  useEffect(() => {
    
     fetchReservations(); 
  }, [url, currentPage, limit]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(url + '/api/booking/getall', { params: { page: currentPage, limit: limit } });
      if(response.data.success){
        setReservations(response.data.bookings);
        setTotalPages(response.data.totalPages);
      }
      else{
        console.error("Failed to fetch reservations:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleStatusChange = (reservation, newStatus, cancellationReason = '') => {
    if (newStatus === 'cancelled') {
      reservation.cancellationReason = cancellationReason;
    }
    reservation.status = newStatus;
    setSelectedReservation({ ...reservation });
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setSelectedReservation(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredReservations = reservations?.filter((reservation) => {
    const isStatusMatch = statusFilter === 'all' || reservation.status === statusFilter;
    const isDateMatch = !selectedDate || new Date(reservation.reservationTime).toDateString() === selectedDate.toDateString();
    return isStatusMatch && isDateMatch;
  });
  if (!reservations) {
    return <div>Loading...</div>;
  }
  return (
    <div className="reservation-container">
      <div className="reservation-list-header">
        <h1>Reservation List</h1>
      </div>
      <div className="reservation-filter">
        <div className="date-filter">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
          />
        </div>
        <div className="status-filter">
          <h3>Filter by status:</h3>
          <select value={statusFilter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="reservation-list-container">
        <div className="reservation-list">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.reservationId}
              className={`reservation-card ${reservation.status}`}
              onClick={() => handleReservationClick(reservation)}
            >
              <h3 className="reservation-title">
                <FaUserFriends className="icon" /> Reservation for {reservation.numberOfPeople} people
              </h3>
              <p className="reservation-date">
                <FaClock className="icon" /> Date: {new Date(reservation.reservationTime).toLocaleDateString()}
              </p>
              <p className="reservation-time">
                Time: {new Date(reservation.reservationTime).toLocaleTimeString()}
              </p>
              <p className="reservation-phone">
                <FaPhone className="icon" /> Phone: <span className="highlight">{reservation.phone}</span>
              </p>
              <p className="reservation-email">
                <FaEnvelope className="icon" /> Email: <span className="highlight">{reservation.email}</span>
              </p>
              <p className={`reservation-status ${reservation.status}`}>
                <FaCheckCircle className="icon" /> Status: <span className="highlight">{reservation.status}</span>
              </p>
              <div className="status-actions">
                {reservation.status !== 'completed' && reservation.status !== 'cancelled' && (
                  <>
                    <button className="action-button" onClick={() => handleStatusChange(reservation, 'accepted')}>Accept</button>
                    <button className="action-button" onClick={() => handleStatusChange(reservation, 'completed')}>Complete</button>
                  </>
                )}
              </div>
            </div>
          ))}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        {selectedReservation ? (
          <div className="reservation-details">
            <h2>Reservation Details</h2>
            <p><strong>Number of People:</strong> {selectedReservation.numberOfPeople}</p>
            <p><strong>Date:</strong> {new Date(selectedReservation.reservationTime).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date(selectedReservation.reservationTime).toLocaleTimeString()}</p>
            <p><strong>Phone:</strong> {selectedReservation.phone}</p>
            <p><strong>Email:</strong> {selectedReservation.email}</p>
            <p><strong>Notes:</strong> {selectedReservation.notes}</p>

            {selectedReservation.status === 'cancelled' && (
              <p className="cancellation-reason">
                Reason for Cancellation: {selectedReservation.cancellationReason}
              </p>
            )}

            {selectedReservation.preOrderedItems.length > 0 && (
              <div className="pre-ordered-items">
                <h3>Pre-Ordered Items:</h3>
                <ul>
                  {selectedReservation.foodDetails.map((item) => (
                    <li key={item.menuItemId}>
                      <img src={`${url}/images/${item.image}`} alt={item.image} ></img>
                      {item.name}
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: {item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="reservation-details">
            <p>No reservation selected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;
