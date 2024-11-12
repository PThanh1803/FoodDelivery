import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './Rate.css';
import write_icon from '../../assets/edit-alt-regular-24.png';
import Comment from '../Comment/Comment';
import FormRating from '../FormRating/FormRating';
import left from '../../assets/chevron-left-regular-24.png';
import right from '../../assets/chevron-right-regular-24.png';
import axios from 'axios';

const RateComponent = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [images, setImages] = useState([]); // State for fetched images
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const { url, token } = useContext(StoreContext);
    const [reload, setReload] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        console.log('Fetching images...');
        fetchStats();
        fetchImages();
    }, []);

    // Fetch data for images
    const fetchImages = async () => {
        try {
            const response = await fetch(url + '/api/review', { method: 'GET' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setImages(data.images);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics data
    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/review/stats');
            if (response.data.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    // Calculate percentage for the rating bars
    const calculatePercentage = (count, totalReviews) => (count / totalReviews) * 100;

    // Show only the first 5 images
    const visibleImages = images.slice(0, 5);
    const remainingImagesCount = images.length - visibleImages.length;

    const handleImageClick = (index) => {
        setCurrentIndex(index);
        setShowImagePopup(true);
    };

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    // UseEffect to trigger when reload is true
    useEffect(() => {
        if (reload) {
            setReload(false); // Reset reload state
        }
    }, [reload]);

    if (!stats) return <div>Loading...</div>;  // Loading state while fetching stats

    return (
        <div className='rate-container'>
            <div className='rate-content-header'>
                <div className='header-title'>
                    <h1>2T Food.</h1>
                    <div className='rate-score-header'>
                        <span className='rate-number'>{stats.avgStarRating.toFixed(1)}</span>
                        <span className='stars'>{'★'.repeat(Math.round(stats.avgStarRating))}{'☆'.repeat(5 - Math.round(stats.avgStarRating))}</span>
                        <span className='rate-count'>({stats.totalReviews} đánh giá)</span>
                    </div>
                </div>
                <div className='rate-button' onClick={() => {
                    if (!token) {
                        alert('Please login to rate');
                        return;
                    }

                    setShowPopup(true)
                }}>
                    <img src={write_icon} alt="write" />
                    <span>Rating now</span>
                </div>
            </div>

            {/* Image Gallery */}
            <div className='image-gallery'>
                {visibleImages.map((src, index) => (
                    <img
                        key={index}
                        src={`${url}/images/reviews/${src}`}
                        alt={`Illustration ${index + 1}`}
                        onClick={() => handleImageClick(index)}
                    />
                ))}
                {remainingImagesCount > 0 && (
                    <div className="remaining-images" onClick={() => handleImageClick(5)}>
                        +{remainingImagesCount} more
                    </div>
                )}
            </div>

            <div className='rate-reviewer'>
                <span className="title">Customer Review</span>
                <div className="summary">
                    <div className='total-rating'>
                        <div className='total-rating-title'>
                            <span className='total-rating-number'>{stats.avgStarRating.toFixed(1)}</span>
                            <span className='total-rating-count'>{stats.totalReviews} đánh giá</span>
                        </div>
                        <span className='total-rating-stars'>
                            {'★'.repeat(Math.round(stats.avgStarRating))}{'☆'.repeat(5 - Math.round(stats.avgStarRating))}
                        </span>
                    </div>

                    {/* Rating Bars */}
                    <div className='rating-bar'>
                        {stats.starBreakdown.map((star, index) => (
                            <div className='rating-row' key={index}>
                                <span className='star-label'>{star._id}</span>
                                <div className='bar'>
                                    <div
                                        className='bar-fill'
                                        style={{ width: `${calculatePercentage(star.count, stats.totalReviews)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Render Comment only when reload is true */}
                {!reload && <Comment />}
            </div>

            {showPopup && <FormRating setShowPopup={setShowPopup} setReload={setReload} />}

            {showImagePopup && (
                <div className="popup-background" onClick={() => setShowImagePopup(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <div className='popup-list'>
                            {images.map((src, index) => (
                                <img
                                    key={index}
                                    src={`${url}/images/reviews/${src}`}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`thumbnail ${currentIndex === index ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))}
                        </div>

                        <div className="popup-navigation">
                            <button onClick={handlePrevImage}>
                                <img src={left} alt="left" />
                            </button>

                            <img src={`${url}/images/reviews/${images[currentIndex]}`} alt={`Full view ${currentIndex + 1}`} className="full-image" />
                            <button onClick={handleNextImage}>
                                <img src={right} alt="right" />
                            </button>
                        </div>
                        <button className="close-popup" onClick={() => setShowImagePopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RateComponent;
