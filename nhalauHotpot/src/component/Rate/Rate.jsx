import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './Rate.css';
import write_icon from '../../assets/edit-alt-regular-24.png';
import Comment from '../Comment/Comment';
import FormRating from '../FormRating/FormRating';
import left from '../../assets/chevron-left-regular-24.png';
import right from '../../assets/chevron-right-regular-24.png';

const RateComponent = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [images, setImages] = useState([]); // State for fetched images
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const { url } = useContext(StoreContext);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(url + '/api/review/'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setImages(data.images); // Assuming your API returns an array of images in an 'images' field
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

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
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    if (loading) return <div>Loading images...</div>;
    if (error) return <div>Error loading images: {error.message}</div>;

    return (
        <div className='rate-container'>
            <div className='rate-content-header'>
                <div className='header-title'>
                    <h1>Tomato.</h1>
                    <div className='rate-score-header'>
                        <span className='rate-number'>3,7</span>
                        <span className='stars'>★★★★☆</span>
                        <span className='rate-count'>(49 đánh giá)</span>
                    </div>
                </div>
                <div className='rate-button' onClick={() => setShowPopup(true)}>
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
                            <span className='total-rating-number'>3,7</span>
                            <span className='total-rating-count'>49 đánh giá</span>
                        </div>
                        <span className='total-rating-stars'>★★★★☆</span>
                    </div>

                    {/* Rating Bars */}
                    <div className='rating-bar'>
                        <div className='rating-row'>
                            <span className='star-label'>5</span>
                            <div className='bar'>
                                <div className='bar-fill' style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <div className='rating-row'>
                            <span className='star-label'>4</span>
                            <div className='bar'>
                                <div className='bar-fill' style={{ width: '10%' }}></div>
                            </div>
                        </div>
                        <div className='rating-row'>
                            <span className='star-label'>3</span>
                            <div className='bar'>
                                <div className='bar-fill' style={{ width: '5%' }}></div>
                            </div>
                        </div>
                        <div className='rating-row'>
                            <span className='star-label'>2</span>
                            <div className='bar'>
                                <div className='bar-fill' style={{ width: '2%' }}></div>
                            </div>
                        </div>
                        <div className='rating-row'>
                            <span className='star-label'>1</span>
                            <div className='bar'>
                                <div className='bar-fill' style={{ width: '50%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Comment />
            </div>

            {showPopup && <FormRating setShowPopup={setShowPopup} />}

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
                                    onClick={() => {
                                        setCurrentIndex(index);
                                    }}
                                />
                            ))}
                        </div>

                        <div className="popup-navigation">
                            <button onClick={handlePrevImage}>
                                <img src={left} alt="left" />
                            </button>
                            <img src={`${url}/images/reviews/${images[currentIndex]}` }alt={`Full view ${currentIndex + 1}`} className="full-image" />
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
