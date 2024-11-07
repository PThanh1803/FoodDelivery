import React from 'react';
import { FaStar, FaChartBar, FaConciergeBell, FaUtensils } from 'react-icons/fa';
import './StatisticsPanel.css';

const StatisticsPanel = ({ stats }) => {
    const { totalReviews, avgStarRating, starBreakdown, avgServiceRating, avgFoodRating } = stats;

    return (
        <div className="statistics-panel">
            <div className="stat">
                <FaChartBar className="stat-icon" />
                <h4>Total Reviews</h4>
                <p>{totalReviews}</p>
            </div>
            <div className="stat">
                <FaStar className="stat-icon" />
                <h4>Average Star Rating</h4>
                <p>{avgStarRating.toFixed(1)} / 5</p>
            </div>
            <div className="stat">
                <FaStar className="stat-icon" />
                <h4>Star Breakdown</h4>
                <ul>
                    {starBreakdown && starBreakdown.map(item => (
                        <li key={item._id}>
                            {Array.from({ length: item._id }, (_, index) => (
                                <FaStar key={index} color="#FFD700" />
                            ))}
                            <span>{item.count} reviews</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="stat">
                <FaConciergeBell className="stat-icon" />
                <h4>Average Service Rating</h4>
                <p>{avgServiceRating.toFixed(1)} / 5</p>
            </div>
            <div className="stat">
                <FaUtensils className="stat-icon" />
                <h4>Average Food Rating</h4>
                <p>{avgFoodRating.toFixed(1)} / 5</p>
            </div>
        </div>
    );
};

export default StatisticsPanel;
