import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewCard from '../ReviewCard/ReviewCard';
import StatisticsPanel from '../StatisticsPanel/StatisticsPanel';
import './ReviewDashBoard.css';

const ReviewDashboard = ({url}) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        responseStatus: 'all',
        starRating: 'all',
        page: 1,
        limit: 5,
    });

    useEffect(() => {
        fetchReviews();
        fetchStatistics();
    }, [filters]);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`${url}/api/review/getreviews`, { params: filters });
            setReviews(data.reviews);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    console.log("Stats: ", stats);
    const fetchStatistics = async () => {
        try {
            const { data } = await axios.get(url + '/api/review/admin/stats');
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch statistics:", error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
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
          setPage(newPage);
          setFilters({ ...filters, page: newPage });
        }
      };

    if(!reviews || !stats){ 
        return <div>Loading...</div>;
    }
    return (
        <div className="review-dashboard">
            <h2>Review Dashboard</h2>

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

                <div className="pagination-controls">
                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                        Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                        Next
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default ReviewDashboard;
