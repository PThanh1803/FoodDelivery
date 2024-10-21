import React, { useState } from 'react';
import './Reservation.css';
import { FaPhone, FaEnvelope, FaCheckCircle, FaClock, FaUserFriends } from 'react-icons/fa'; // Import icons from react-icons
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the datepicker styles
import './Reservation.css';
// Sample reservation data (same as before)
const reservationsData = [
  {
    reservationId: 'reservation_id_1',
    userId: 'user_id_1',
    phone: '+1234567890',
    email: 'user@example.com',
    reservationTime: '2024-10-14T19:00:00Z',
    numberOfPeople: 4,
    notes: 'Prefer a window seat.',
    preOrderedItems: [
      { menuItemId: 'menu_item_id_1', quantity: 2 },
      { menuItemId: 'menu_item_id_2', quantity: 1 },
    ],
    status: 'pending',
  },
  {
    reservationId: 'reservation_id_2',
    userId: 'user_id_2',
    phone: '+0987654321',
    email: 'anotheruser@example.com',
    reservationTime: '2024-10-15T20:00:00Z',
    numberOfPeople: 2,
    notes: 'Birthday celebration.',
    preOrderedItems: [],
    status: 'accepted',
  },
  // Add more reservations as needed
];

const Reservation = () => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null); // State for date filter

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleStatusChange = (reservation, newStatus) => {
    reservation.status = newStatus;
    setSelectedReservation({ ...reservation });
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setSelectedReservation(null); // Reset selection when filtering
  };

  const filteredReservations = reservationsData.filter((reservation) => {
    const isStatusMatch =
      statusFilter === 'all' || reservation.status === statusFilter;
    
    const isDateMatch =
      !selectedDate || 
      new Date(reservation.reservationTime).toDateString() === selectedDate.toDateString();

    return isStatusMatch && isDateMatch; // Filter by both status and date
  });


  return (
    <div className="reservation-container">
      <div className="reservation-list-header">
        <h1>Reservation List</h1>
      </div>
      <div className="reservation-filter">
      <div className="date-filter">        
            <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)} // Update selected date
            dateFormat="yyyy-MM-dd" // Set desired format
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
            </select>
        </div>
        
      </div>
      
      <div className="reservation-list-container">
        <div className="reservation-list">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.reservationId}
              className={`reservation-card ${reservation.status}`} // Apply class based on status
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
              <p className="reservation-status">
                <FaCheckCircle className="icon" /> Status: <span className="highlight">{reservation.status}</span>
              </p>
              <div className="status-actions">
                {reservation.status !== 'completed' && (
                  <>
                    <button className="action-button" onClick={() => handleStatusChange(reservation, 'accepted')}>Accept</button>
                    <button className="action-button" onClick={() => handleStatusChange(reservation, 'completed')}>Complete</button>
                  </>
                )}
              </div>
            </div>
          ))}
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
          
          {selectedReservation.preOrderedItems.length > 0 && (
              <div className="pre-ordered-items">
                  <h3>Pre-Ordered Items:</h3>
                  <ul>
                      {selectedReservation.preOrderedItems.map(item => (
                          <li key={item.menuItemId}>
                              <strong>Menu Item ID:</strong> {item.menuItemId} 
                              <span>Quantity: {item.quantity}</span>
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
