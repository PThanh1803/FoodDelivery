import React, { useState } from 'react';
import axios from 'axios';
import { FaStar, FaUtensils, FaConciergeBell, FaRegCalendarAlt } from 'react-icons/fa';
import './ReviewCard.css';

const ReviewCard = ({ review, onRespondSuccess, url }) => {
    const [showResponseInput, setShowResponseInput] = useState(false);
    const [responseText, setResponseText] = useState(review.response || '');

    const handleResponseClick = () => {
        setShowResponseInput(!showResponseInput);
    };

    const handleResponseChange = (e) => {
        setResponseText(e.target.value);
    };

    const handleResponseSubmit = async () => {
        try {
            await axios.put(`${url}/api/review/${review._id}?type=response`, { response: responseText });
            onRespondSuccess(review._id, responseText);
            setShowResponseInput(false);
        } catch (error) {
            console.error("Failed to submit response:", error);
        }
    };

    // Render star rating based on the review's star value
    const renderStarRating = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar
                key={index}
                color={index < rating ? '#FFD700' : '#ddd'} // Filled stars in gold, unfilled in gray
                className="star-icon"
            />
        ));
    };

    return (
        <div className="review-card">
            <div className="review-avatar">
                <img src={`${url}/images/avatars/${review.userImage}`} alt={`avatar`} />
            </div>
            <div className="review-content">
                <div className="review-header">
                    <h4>{review.userName}</h4>
                    <p><FaRegCalendarAlt /> {new Date(review.date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="review-quality">
                    <p><FaUtensils /> Food Rate: {review.foodRate}/5</p>
                    <p><FaConciergeBell /> Service Rate: {review.serviceRate}/5</p>
                    <p>Type: {review.type}</p>
                </div>
                <div className="review-stars">
                    {renderStarRating(review.star)}
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-images">
                    {review.pictures && review.pictures.length > 0 && review.pictures.map((img, index) => (
                        <img key={index} src={`${url}/images/reviews/${img}`} alt={`Review image ${index + 1}`} />
                    ))}
                </div>

                <button className="response-button" onClick={handleResponseClick}>
                    {showResponseInput ? 'Cancel' : 'Respond'}
                </button>

                {showResponseInput && (
                    <div className="response-input">
                        <textarea
                            value={responseText}
                            onChange={handleResponseChange}
                            placeholder="Write your response..."
                        />
                        <button className="submit-response" onClick={handleResponseSubmit}>Submit Response</button>
                    </div>
                )}

                {review.response && !showResponseInput && (
                    <div className="existing-response">
                        <p><strong>Admin Response:</strong> {review.response}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;
