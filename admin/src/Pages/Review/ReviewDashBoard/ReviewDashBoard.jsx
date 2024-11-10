import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewCard from '../ReviewCard/ReviewCard';
import StatisticsPanel from '../StatisticsPanel/StatisticsPanel';
import './ReviewDashBoard.css';

const ReviewDashboard = ({ url }) => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterRating, setFilterRating] = useState('');
    const [stats, setStats] = useState(null);
    const reviewsPerPage = 5; // Set reviews per page

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    `${url}/api/review`, 
                    { params: { page: currentPage, limit: reviewsPerPage, starRating: filterRating } }
                );
                setReviews(response.data.reviews);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        const fetchStatistics = async () => {
            try {
                const { data } = await axios.get(`${url}/api/review/stats`);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
            }
        };

        fetchReviews();
        fetchStatistics();
    }, [currentPage, filterRating, url]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === "starRating") setFilterRating(value === "all" ? '' : parseInt(value));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleRespondSuccess = (reviewId, responseText) => {
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review._id === reviewId ? { ...review, response: responseText } : review
            )
        );
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (!reviews || !stats) {
        return <div>Loading...</div>;
    }

    return (
        <div className="review-dashboard">
            <h2>Review Dashboard</h2>

            {/* Statistics Panel */}
            {stats && <StatisticsPanel stats={stats} />}

            {/* Filter Bar */}
            <div className="filter-bar">
                <input type="date" name="startDate" onChange={handleFilterChange} />
                <input type="date" name="endDate" onChange={handleFilterChange} />
                <select name="responseStatus" onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="responded">Responded</option>
                    <option value="unresponded">Unresponded</option>
                </select>
                <select name="starRating" onChange={handleFilterChange}>
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>

            {/* Review List */}
            <div className="review-list">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review._id}
                        review={review}
                        onRespondSuccess={handleRespondSuccess}
                        url={url}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ReviewDashboard;
