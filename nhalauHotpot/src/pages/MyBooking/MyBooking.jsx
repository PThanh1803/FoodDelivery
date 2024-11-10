import React, { useState, useEffect, useContext } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaClock,
  FaUserFriends,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./MyBooking.css";
import { StoreContext } from "../../context/StoreContext";
import { useLocation } from "react-router-dom";

const MyBooking = () => {
  const { url, token, userInfo } = useContext(StoreContext);
  const { state } = useLocation();
  const [bookings, setBookings] = useState();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [highlightedOrder, setHighlightedOrder] = useState(null);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, url]);

  const fetchBookings = async (page) => {
    try {
      console.log(userInfo._id);
      const response = await axios.get(
        `${url}/api/booking/${userInfo._id}?page=${page}&limit=${limit}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        setBookings(response.data.bookings);
        setTotalPages(response.data.totalPages);
        localStorage.setItem("bookings", JSON.stringify(response.data.bookings)); // Store bookings in localStorage
        if (state && state.bookingId) {
          const { bookingId } = state;
          setHighlightedOrder(bookingId);
          setTimeout(() => setHighlightedOrder(null), 4000);
        }
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };


  const handleCancelBooking = (booking) => {
    setBookingToCancel(booking);
    setShowCancelPopup(true);
  };



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings?.filter((booking) => {
    const isStatusMatch =
      statusFilter === "all" || booking.status === statusFilter;
    const isDateMatch =
      !selectedDate ||
      new Date(booking.reservationTime).toDateString() ===
      selectedDate.toDateString();
    return isStatusMatch && isDateMatch;
  });

  const handleCancelConfirm = async () => {
    if (!cancelReason) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    try {
      const response = await axios.put(
        `${url}/api/booking/${bookingToCancel._id}`,
        {
          status: "cancelled",
          cancellationReason: cancelReason,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      console.log("Response from cancelling booking:", response.data);
      if (response.data.success) {
        // Update local state
        fetchBookings(currentPage);
        setShowCancelPopup(false);
        setCancelReason("");
        setBookingToCancel(null);
      } else {
        console.error(response.data.message);
        alert("Failed to cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const convertUTCToLocalTime = (utcTimeString) => {
    const utcTime = new Date(utcTimeString);
    const localTime = new Date(utcTime.getTime() + utcTime.getTimezoneOffset() * 60 * 1000); // Adjust for UTC+7
    return localTime.toLocaleTimeString("en-US", { timeStyle: "short" }); // Returns time in local format
  };

  const convertUTCToLocalDate = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000); // Adjust for UTC+7
    return localDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }); // Returns date in local format
  };

  if (!bookings) {
    return (
      <div className="my-booking-container">
        <div className="booking-list-header">
          <h1>My Bookings</h1>
        </div>
        <div className="booking-list-container">
          <div className="booking-list">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="my-booking-container">
      <div className="booking-list-header">
        <h1>My Bookings</h1>
      </div>
      <div className="booking-filter">
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

      <div className="booking-list-container">
        <div className="booking-list">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className={`booking-card ${booking.status} ${selectedBooking && selectedBooking._id === booking._id
                ? "selected"
                : ""
                } ${booking._id === highlightedOrder ? "highlight-same" : ""} `}
              onClick={() => handleBookingClick(booking)}
            >
              <h3 className="booking-title">
                <FaUserFriends className="icon" /> Booking for{" "}
                {booking.numberOfPeople} people
              </h3>
              <p className="booking-date">
                <FaClock className="icon" /> Date:{" "}
                {convertUTCToLocalDate(booking.reservationTime)}
              </p>
              <p className="booking-time">
                Time: {convertUTCToLocalTime(booking.reservationTime)}
              </p>
              <p className="booking-phone">
                <FaPhone className="icon" /> Phone:{" "}
                <span className="highlight">{booking.phone}</span>
              </p>
              <p className="booking-email">
                <FaEnvelope className="icon" /> Email:{" "}
                <span className="highlight">{booking.email}</span>
              </p>
              <p className={`booking-status ${booking.status}`}>
                <FaCheckCircle className="icon" /> Status:{" "}
                <span className="highlight">{booking.status}</span>
              </p>
              {booking.status === "pending" && (
                <button
                  className="cancel-button"
                  onClick={() => handleCancelBooking(booking)}
                >
                  Cancel
                </button>
              )}
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

        {selectedBooking ? (
          <div className="booking-details">
            <h2>Booking Details</h2>
            <p>
              <strong>Number of People:</strong>{" "}
              {selectedBooking.numberOfPeople}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {convertUTCToLocalDate(selectedBooking.reservationTime)}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {convertUTCToLocalTime(selectedBooking.reservationTime)}
            </p>
            <p>
              <strong>Phone:</strong> {selectedBooking.phone}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.email}
            </p>
            <p>
              <strong>Notes:</strong> {selectedBooking.notes}
            </p>

            {selectedBooking.status === "cancelled" && (
              <p className="cancellation-reason">
                Reason for Cancellation: {selectedBooking.cancellationReason}
              </p>
            )}

            {selectedBooking.preOrderedItems.length > 0 && (
              <div className="pre-ordered-items">
                <h3>Pre-Ordered Items:</h3>
                <ul>
                  {selectedBooking.foodDetails.map((item) => (
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
          <div className="booking-details">
            <p>No booking selected.</p>
          </div>
        )}
      </div>

      {showCancelPopup && (
        <div className="cancel-popup">
          <div className="cancel-popup-content show">
            <h3>Cancel Booking</h3>
            <label>Reason for cancellation:</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleCancelConfirm}>Confirm Cancellation</button>
              <button onClick={() => setShowCancelPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBooking;
