import React, { useState } from 'react';
import './FormRating.css';

// eslint-disable-next-line react/prop-types
const FormRating = ({ setShowPopup }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [overallRating, setOverallRating] = useState(0); // Đánh giá tổng quan
    const [foodRating, setFoodRating] = useState(0); // Đánh giá chất lượng đồ ăn
    const [serviceRating, setServiceRating] = useState(0); // Đánh giá dịch vụ

    // Hàm để xử lý click vào ngôi sao tổng quan
    const handleOverallStarClick = (index) => {
        setOverallRating(index + 1);
    };

    // Hàm để xử lý click vào ngôi sao cho Food Quality
    const handleFoodStarClick = (index) => {
        setFoodRating(index + 1);
    };

    // Hàm để xử lý click vào ngôi sao cho Service
    const handleServiceStarClick = (index) => {
        setServiceRating(index + 1);
    };

    return (
        <div className='form-rating-popup'>
            <div className="form-rating-container">
                <h2>Rate Your Experience</h2>
                <div className="form-rating-user">
                    <img src='https://via.placeholder.com/50x50' alt='user' />
                    <div className='form-rating-user-info'>
                        <p>John Doe</p>
                        <p>Đăng công khai trên Fanpage</p>
                    </div>
                </div>

                {/* Đánh giá tổng quan */}
                <div className="stars-form">
                    {[...Array(5)].map((_, index) => (
                        <span
                            key={index}
                            onClick={() => handleOverallStarClick(index)}
                            className={`star ${index < overallRating ? 'active' : ''}`}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* Đánh giá chất lượng đồ ăn */}
                <div className="form-rating-content">
                    <h3>Food Quality</h3>
                    <div className="stars-form">
                        {[...Array(5)].map((_, index) => (
                            <span
                                key={index}
                                onClick={() => handleFoodStarClick(index)}
                                className={`star ${index < foodRating ? 'active' : ''}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                {/* Đánh giá dịch vụ */}
                <div className="form-rating-content">
                    <h3>Service</h3>
                    <div className="stars-form">
                        {[...Array(5)].map((_, index) => (
                            <span
                                key={index}
                                onClick={() => handleServiceStarClick(index)}
                                className={`star ${index < serviceRating ? 'active' : ''}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <div className="form-rating-content">
                    <h4>Do you want to dine in or have it delivered?</h4>
                    <div
                        className={`option dine-in ${selectedOption === 'dine-in' ? 'active' : ''}`}
                        onClick={() => setSelectedOption('dine-in')}
                    >
                        Dine in
                    </div>
                    <div
                        className={`option delivery ${selectedOption === 'delivery' ? 'active' : ''}`}
                        onClick={() => setSelectedOption('delivery')}
                    >
                        Delivery
                    </div>
                </div>

                <textarea className="rating-textarea" placeholder='Nhập đánh giá' />
                <button className="add-image-btn">Thêm ảnh</button>

                <div className="form-rating-actions">
                    <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
                    <button className="submit-btn">Submit</button>
                </div>
            </div>
        </div>
    );
}

export default FormRating;
