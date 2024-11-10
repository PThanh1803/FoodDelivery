import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './Comment.css';
import FormRating from '../FormRating/FormRating';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons for menu, edit, and delete

const reviewsPerPage = 5;

const StarRating = ({ rating }) => (
    <div className="star-rating">
        {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className={index < rating ? "filled-star" : "empty-star"}>
                ★
            </span>
        ))}
    </div>
);

// Format date using .toLocaleDateString()
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // 'en-GB' formats as dd/mm/yyyy
};



const ReviewCard = ({ review, url, userID, onUpdateClick, onDeleteClick }) => {
    const [menuOpen, setMenuOpen] = useState(false); // State to track if menu is open
    const toggleRef = React.useRef(null);
    const toggleMenu = (event) => {
        event.stopPropagation(); // Stop the event from propagating to document click listener
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (toggleRef.current && !toggleRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="review-card">
            <div className="review-avatar">
                <img src={review.userImage} alt="User avatar" />
            </div>
            <div className="review-content">
                <div className="review-header">
                    <div className="user-info"> 
                        <h4>{userID === review.userID ? 'You' : review.userName}</h4>
                        <p>{formatDate(review.date)}</p>

                    </div>
                    
                    {userID === review.userID && (
                    <div className="review-actions">
                        {/* Three-dot icon to toggle the menu */}
                        <div className="menu-icon" onClick={toggleMenu}>
                            <FaEllipsisV />
                        </div>

                        {/* Dropdown menu */}
                        {menuOpen && (
                            <div className="menu-dropdown" ref={toggleRef}>
                                <button onClick={() => onUpdateClick(review)} className="menu-item">
                                    <FaEdit /> Update
                                </button>
                                <button onClick={() => onDeleteClick(review._id)} className="menu-item">
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
                </div>
                <div className="review-quality">
                    <p>FoodRate: {review.foodRate}/5</p>
                    <p>ServiceRate: {review.serviceRate}/5</p>
                    <p>Type: {review.type}</p>
                </div>
                <StarRating rating={review.star} />
                <p>{review.comment}</p>
                <div className="review-images">
                    {review.pictures && review.pictures.length > 0 && (
                        review.pictures.map((img, index) => (
                            <img key={index} src={`${url}/images/reviews/${img}`} alt={`Review image ${index + 1}`} />
                        ))
                    )}
                </div>
                {review.response && (
                    <div className="review-response">
                        <img src="https://via.placeholder.com/150" alt="Response avatar" className="response-avatar" />
                        <div>
                        <p className="review-response-label">Admin Response</p>
                        <p className="review-response-text">{review.response}</p>
                        </div>
                    </div>
                )}

                
            </div>
        </div>
    );
};



const PlaceReview = () => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterRating, setFilterRating] = useState('');
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [currentImages, setCurrentImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const { url, userInfo } = useContext(StoreContext);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${url}/api/review?page=${currentPage}&limit=${reviewsPerPage}&&starRating=${filterRating}`);
                setReviews(response.data.reviews);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [currentPage, filterRating, url]);

    const handleRatingFilter = (rating) => {
        setFilterRating(rating);
        setCurrentPage(1); // Reset to the first page after filter change
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleUpdateClick = (review) => {
        setSelectedReview(review);
        setCurrentImages(review.pictures);
        setNewImages([]);
        setShowImagePopup(true);
    };

    const handleDeleteClick = async (reviewId) => {
        try {
            await axios.delete(`${url}/api/review/${reviewId}`);
            setReviews(reviews.filter(review => review._id !== reviewId));
            alert("Review deleted successfully");
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };
    const handleClosePopup = () => {
        setShowImagePopup(false);
        setSelectedReview(null);
        setCurrentImages([]);
        setNewImages([]);
    };

    // Remove an image from current images
    const handleDeleteCurrentImage = (index) => {
        setCurrentImages(currentImages.filter((_, i) => i !== index));
    };

    // Add new selected images
    const handleNewImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const fileURLs = files.map(file => URL.createObjectURL(file));
        setNewImages((prevImages) => [...prevImages, ...fileURLs]);
    };

    // Remove an image from new images
    const handleDeleteNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const handleSaveChanges = async () => {
        // Implement logic to update images on server side if needed
        // e.g., make API request to save currentImages and newImages
        handleClosePopup(); // Close popup after saving
    };
    return (
        <div className="reviews-container">
            <div className="filter-container">
                <button onClick={() => handleRatingFilter('all')} className={filterRating === 'all' ? 'active' : ''}>All</button>
                <button onClick={() => handleRatingFilter(5)} className={filterRating === 5 ? 'active' : ''}>5 Stars</button>
                <button onClick={() => handleRatingFilter(4)} className={filterRating === 4 ? 'active' : ''}>4 Stars</button>
                <button onClick={() => handleRatingFilter(3)} className={filterRating === 3 ? 'active' : ''}>3 Stars</button>
                <button onClick={() => handleRatingFilter(2)} className={filterRating === 2 ? 'active' : ''}>2 Stars</button>
                <button onClick={() => handleRatingFilter(1)} className={filterRating === 1 ? 'active' : ''}>1 Star</button>
            </div>

            <div className="reviews-list">
                {reviews.map(review => (
                    <ReviewCard key={review._id} review={review} url={url} userID={userInfo._id} onDeleteClick={handleDeleteClick} onUpdateClick={handleUpdateClick}/>
                ))}
            </div>

            <div className="pagination-controls">
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {/* Popup for Updating Images */}
            {showImagePopup &&  <FormRating setShowPopup={setShowImagePopup} mode="edit" reviewData={selectedReview} /> }
        </div>
    );
};

export default PlaceReview;
