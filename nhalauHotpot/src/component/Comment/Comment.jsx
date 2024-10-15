/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './Comment.css';

const reviews = [
    {
        ID: 1,
        userImage: "https://randomuser.me/api/portraits/women/1.jpg",
        userID: "Arlene McCoy",
        date: "2 October 2012",
        star: 5,
        type: "Online",
        foodRate: 4,
        serviceRate: 5,
        pictures: [],
        comment: "Good Tour, Really Well Organised!"
    },
    {
        ID: 2,
        userImage: "https://randomuser.me/api/portraits/women/2.jpg",
        userID: "Jenny Wilson",
        date: "2 October 2012",
        star: 4,
        type: "Offline",
        foodRate: 3,
        serviceRate: 4,
        pictures: [],
        comment: "Informative But Disappointed Not Seeing Changing Of The Guards"
    },
    {
        ID: 3,
        userImage: "https://randomuser.me/api/portraits/men/3.jpg",
        userID: "Ralph Edwards",
        date: "2 October 2012",
        star: 4,
        type: "Online",
        foodRate: 5,
        serviceRate: 4,
        pictures: [],
        comment: "I Love Their Way Of Style. The tour was very well organised. One minus is that you get completely bombarded with information..."
    },
    {
        ID: 4,
        userImage: "https://randomuser.me/api/portraits/women/4.jpg",
        userID: "Courtney Henry",
        date: "2 October 2012",
        star: 4,
        type: "Online",
        foodRate: 4,
        serviceRate: 5,
        pictures: [],
        comment: "Enjoyed Very Much. The tour was very well organised. One minus is that you get completely bombarded with information..."
    },
    {
        ID: 5,
        userImage: "https://randomuser.me/api/portraits/men/5.jpg",
        userID: "Devon Lane",
        date: "2 October 2012",
        star: 4,
        type: "Offline",
        foodRate: 5,
        serviceRate: 4,
        pictures: [],
        comment: "Nice!!!!!!! The tour was very well organised. One minus is that you get completely bombarded with information..."
    },
    {
        ID: 6,
        userImage: "https://randomuser.me/api/portraits/men/6.jpg",
        userID: "Mark Simpson",
        date: "2 October 2012",
        star: 5,
        type: "Online",
        foodRate: 5,
        serviceRate: 5,
        pictures: [],
        comment: "Amazing experience, great guide and wonderful service..."
    },
    {
        ID: 7,
        userImage: "https://randomuser.me/api/portraits/women/7.jpg",
        userID: "Alice Brown",
        date: "2 October 2012",
        star: 3,
        type: "Offline",
        foodRate: 3,
        serviceRate: 4,
        pictures: [],
        comment: "It was good, but could have been better..."
    }
];

// Tính tổng số sao trung bình
const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

const StarRating = ({ rating }) => {
    return (
        <div className="star-rating">
            {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className={index < rating ? "filled-star" : "empty-star"}>
                    ★
                </span>
            ))}
        </div>
    );
};

const ReviewCard = ({ review }) => (
    <div className="review-card">
        <div className="review-avatar">
            <img src={review.userImage} alt={`${review.userID} avatar`} />
        </div>
        <div className="review-content">
            <div className="review-header">
                <h4>{review.userID}</h4>
                <p>{review.date}</p>
            </div>
            <div className="review-quality">
                <p>FoodRate: {review.foodRate}/5</p>
                <p>ServiceRate: {review.serviceRate}/5</p>
                <p>Type: {review.type}</p>
            </div>
            <StarRating rating={review.star} />
            <p>{review.comment}</p>


        </div>
    </div>
);

const PlaceReview = () => {
    const [visibleReviews, setVisibleReviews] = useState(5); // Hiển thị 5 review đầu tiên
    const [filterRating, setFilterRating] = useState(0); // Lọc theo số sao, 0 là không lọc
    const [showAllReviews, setShowAllReviews] = useState(true); // Trạng thái của "Show More/Less"

    // Hàm hiển thị toàn bộ review
    const showMoreReviews = () => {
        setVisibleReviews(filteredReviews.length); // Hiển thị toàn bộ review
        setShowAllReviews(false); // Đổi trạng thái để hiển thị nút "Show Less"
    };

    // Hàm thu gọn lại review
    const showLessReviews = () => {
        setVisibleReviews(5); // Thu gọn lại chỉ hiển thị 5 review
        setShowAllReviews(true); // Đổi trạng thái về "Show More"
    };

    const handleRatingFilter = (rating) => {
        setFilterRating(rating);
        setVisibleReviews(5); // Reset lại số review hiển thị khi lọc
        setShowAllReviews(true); // Khi lọc mới, đặt lại trạng thái nút về "Show More"
    };

    // Lọc các review theo số sao đã chọn (nếu có)
    const filteredReviews = filterRating > 0
        ? reviews.filter(review => review.rating === filterRating)
        : reviews;

    return (
        <div className="reviews-container">


            {/* Bộ lọc theo số sao */}
            <div className="filter-container">
                <button onClick={() => handleRatingFilter(0)} className={filterRating === 0 ? 'active' : ''}>All</button>
                <button onClick={() => handleRatingFilter(5)} className={filterRating === 5 ? 'active' : ''}>5 Stars</button>
                <button onClick={() => handleRatingFilter(4)} className={filterRating === 4 ? 'active' : ''}>4 Stars</button>
                <button onClick={() => handleRatingFilter(3)} className={filterRating === 3 ? 'active' : ''}>3 Stars</button>
                <button onClick={() => handleRatingFilter(2)} className={filterRating === 2 ? 'active' : ''}>2 Stars</button>
                <button onClick={() => handleRatingFilter(1)} className={filterRating === 1 ? 'active' : ''}>1 Star</button>
            </div>

            <div className="reviews-list">
                {filteredReviews.slice(0, visibleReviews).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
            <div className="show-more-container">
                {visibleReviews < filteredReviews.length && (
                    <button onClick={showMoreReviews} className="show-more-btn">
                        Show More
                    </button>
                )}

                {visibleReviews === filteredReviews.length && visibleReviews > 5 && (
                    <button onClick={showLessReviews} className="show-more-btn">
                        Show Less
                    </button>
                )}
            </div>

        </div>
    );
};

export default PlaceReview;
