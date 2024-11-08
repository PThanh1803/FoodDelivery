import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './Comment.css';

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


const ReviewCard = ({ review, url }) => (
    <div className="review-card">
        <div className="review-avatar">
            <img src={review.userImage} alt={`${review.userID} avatar`} />
        </div>
        <div className="review-content">
            <div className="review-header">
                <h4>{review.userName}</h4>
                <p>{formatDate(review.date)}</p>
            </div>
            <div className="review-quality">
                <p>FoodRate: {review.foodRate}/5</p>
                <p>ServiceRate: {review.serviceRate}/5</p>
                <p>Type: {review.type}</p>
            </div>
            <StarRating rating={review.star} />
            <p>{review.comment}</p>
            <div className="review-images">
                {review.pictures && review.pictures.length > 0 ? (
                    review.pictures.map((img, index) => (
                        <img key={index} src={`${url}/images/reviews/${img}`} alt={`Review image ${index + 1}`} />

                    ))
                ) : null}
            </div>
            {review.response && (
                <div className="review-response">
                    <img src={review.userImage} alt="Response avatar" className="response-avatar" />

                    <p className="review-response-label">Admin Response:</p>
                    <p className="review-response-text">
                        {review.response}
                    </p>

                </div>
            )}
        </div>
    </div>
);

const PlaceReview = () => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterRating, setFilterRating] = useState(0);
    const { url } = useContext(StoreContext);
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
                    <ReviewCard key={review._id} review={review} url={url} />
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
        </div>
    );
};

export default PlaceReview;
