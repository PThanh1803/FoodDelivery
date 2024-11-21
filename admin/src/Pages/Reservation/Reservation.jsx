import React, { useState, useEffect } from 'react';
import './Reservation.css';
import { FaPhone, FaEnvelope, FaCheckCircle, FaClock, FaUserFriends } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Reservation = ({ url }) => {
  const [reservations, setReservations] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [highlightedDates, setHighlightedDates] = useState([]);

  const limit = 3;

  // Fetch reservations for pagination and filters
  useEffect(() => {
    fetchReservations();
  }, [url, currentPage, limit, statusFilter, selectedDate]); // Added filters as dependencies

  // Fetch confirmed and incomplete reservations for calendar highlighting
  useEffect(() => {
    fetchCalendarBookings();
  }, [url]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(url + '/api/booking/', {
        params: {
          page: currentPage,
          limit,
          status: statusFilter === 'all' ? undefined : statusFilter, // Only send status filter if it's not 'all'
          date: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined, // Send date in YYYY-MM-DD format
        },
      });
      if (response.data.success) {
        setReservations(response.data.bookings);
        setTotalPages(response.data.totalPages);
      } else {
        console.error('Failed to fetch reservations:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  const fetchCalendarBookings = async () => {
    try {
      const response = await axios.get(url + '/api/booking/');
      if (response.data.success) {
        const dates = response.data.bookings
          .filter((booking) => booking.status === 'confirmed') // Filter bookings that are confirmed
          .map((booking) => new Date(booking.reservationTime)); // Map to reservation dates
        setHighlightedDates(dates);
      } else {
        console.error('Failed to fetch calendar bookings:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to fetch calendar bookings:', error);
    }
  };

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
  };

  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      const response = await axios.put(`${url}/api/booking/${reservationId}`, { status: newStatus }, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      if (response.data.success) {
        fetchReservations(); // Refresh list
        fetchCalendarBookings(); // Refresh highlighted dates
        setSelectedReservation(null); // Clear selected reservation
        toast.success(response.data.message);
      } else {
        console.error('Failed to update reservation status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  const handleStatusChange = (reservation, newStatus) => {
    updateReservationStatus(reservation._id, newStatus);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setSelectedReservation(null); // Reset selected reservation
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredReservations = reservations?.filter((reservation) => {
    const isStatusMatch = statusFilter === 'all' || reservation.status === statusFilter;
    const isDateMatch = !selectedDate || new Date(reservation.reservationTime).toDateString() === selectedDate.toDateString();
    return isStatusMatch && isDateMatch;
  });

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Check if this date is in the highlightedDates array
      const isHighlighted = highlightedDates.some(
        (highlightedDate) => date.toDateString() === highlightedDate.toDateString()
      );
      return isHighlighted ? 'highlight-blue' : null;
    }
    return null;
  };

  if (!reservations) {
    return <div>Loading...</div>;
  }

  const convertUTCToLocalTime = (utcTimeString) => {
    const utcTime = new Date(utcTimeString);
    const localTime = new Date(utcTime.getTime() + utcTime.getTimezoneOffset() * 60 * 1000); // Adjust for UTC+7
    return localTime.toLocaleTimeString('en-US', { timeStyle: 'short' }); // Returns time in local format
  };

  const convertUTCToLocalDate = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000); // Adjust for UTC+7
    return localDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }); // Returns date in local format
  };

  return (
    <div className="reservation-container">
      <div className="reservation-list-header">
        <h1>Reservation List</h1>
        <Calendar tileClassName={tileClassName} onClickDay={(date) => setSelectedDate(date)} />
      </div>
      <div className="reservation-filter">
        <div className="date-filter">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            highlightDates={highlightedDates.map((date) => ({ date, className: 'highlight-blue' }))}
          />
        </div>
        <div className="status-filter">
          <h3>Filter by status:</h3>
          <select value={statusFilter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="reservation-list-container">
        <div className="reservation-list">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation._id}
              className={`reservation-card ${reservation.status}`}
              onClick={() => handleReservationClick(reservation)}
            >
              <h3 className="reservation-title">
                <FaUserFriends className="icon" /> Reservation for {reservation.numberOfPeople} people
              </h3>
              <p className="reservation-date">
                <FaClock className="icon" /> Date: {convertUTCToLocalDate(reservation.reservationTime)}
              </p>
              <p className="reservation-time">
                Time: {convertUTCToLocalTime(reservation.reservationTime)}
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
                    {reservation.status === 'pending' && <button className="action-button" onClick={() => handleStatusChange(reservation, 'confirmed')}>Confirm</button>}
                    {reservation.status === 'confirmed' && <button className="action-button" onClick={() => handleStatusChange(reservation, 'completed')}>Complete</button>}
                  </>
                )}
              </div>
            </div>
          ))}
          <div className="pagination-controls">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || filteredReservations.length === 0}>
              Next
            </button>
          </div>
        </div>

        {selectedReservation ? (
          <div className="reservation-details">
            <h2>Reservation Details</h2>
            <p><strong>Number of People:</strong> {selectedReservation.numberOfPeople}</p>
            <p><strong>Date:</strong> {convertUTCToLocalDate(selectedReservation.reservationTime)}</p>
            <p><strong>Time:</strong> {convertUTCToLocalTime(selectedReservation.reservationTime)}</p>
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
                  {selectedReservation.foodDetails?.map((item) => (
                    <li key={item.menuItemId}>
                      <img src={`${url}/images/${item.image}`} alt={item.image} />
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
