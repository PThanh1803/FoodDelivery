import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './CommentHome.css';

const CommentHome = () => {
    const { url, userInfo } = useContext(StoreContext);
    const [comments, setComments] = useState([]);
    const [visibleIndex, setVisibleIndex] = useState(0);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${url}/api/review?page=1&limit=6&starReview=5`);
                const data = await response.json();
                if (data.success) {
                    setComments(data.reviews);
                } else {
                    console.error("Failed to fetch comments:", data.message);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [url]);
    console.log(comments);
    // Set up an interval to cycle through comments every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleIndex((prevIndex) => (prevIndex + 1) % comments.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [comments]);

    // Determine the comments to display based on visibleIndex
    const visibleComments = comments.slice(visibleIndex, visibleIndex + 3).concat(
        comments.slice(0, Math.max(0, (visibleIndex + 3) - comments.length))
    );

    // Handlers for Next and Previous buttons
    const handleNext = () => {
        setVisibleIndex((prevIndex) => (prevIndex + 1) % comments.length);
    };

    const handlePrevious = () => {
        setVisibleIndex((prevIndex) => (prevIndex - 1 + comments.length) % comments.length);
    };


    return (
        <div className="comment-home-container">
            <button className="comment-button" onClick={handlePrevious}> ❮ </button>
            {visibleComments.map((comment, i) => (
                <GoodCommentCard key={i} comment={comment} />
            ))}

            <button className="comment-button" onClick={handleNext}>❯</button>
        </div>
    );
};

const GoodCommentCard = ({ comment }) => {
    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);

        // Định dạng ngày tháng năm
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = dateObj.getFullYear();

        // Định dạng giờ và phút
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        return {
            fullDate: `${day}/${month}/${year}`,
            time: `${hours}:${minutes}`
        }; // Trả về đối tượng chứa cả ngày và giờ
    };

    const { fullDate, time } = formatDate(comment.date);
    return (
        <div className="good-comment-card">
            <img className="good-comment-card-avatar" src={comment.userImage} alt="User Avatar" />
            <div className="stars-form">
                {[...Array(5)].map((_, index) => (
                    <span
                        key={index}
                        className={`star ${index < comment.star ? 'active' : ''}`} // Add 'active' class for filled stars
                    >
                        ★
                    </span>
                ))}
            </div>
            <div className="good-comment-card-username">
                <strong>{comment.userName}</strong>
                <span className="good-comment-card-date">
                    <span className='day'>{fullDate}</span> {/* Date with font size 18 */}
                    <span className='time'> {time}</span> {/* Time with font size 15 */}
                </span>
            </div>
            <p className="good-comment-card-comment">{comment.comment}</p>
        </div>
    );
}

export default CommentHome;
