import React, { useState, useContext } from 'react';
import './FormRating.css';
import { StoreContext } from '../../context/StoreContext';

// eslint-disable-next-line react/prop-types
const FormRating = ({ setShowPopup }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [overallRating, setOverallRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [imageFiles, setImageFiles] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const { url, userInfo } = useContext(StoreContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleOverallStarClick = (index) => {
        setOverallRating(index + 1);
    };

    const handleFoodStarClick = (index) => {
        setFoodRating(index + 1);
    };

    const handleServiceStarClick = (index) => {
        setServiceRating(index + 1);
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setImageFiles(prevFiles => [...prevFiles, ...files]);
    };

    const handleImageRemove = (index) => {
        setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const addReview = async () => {
        if (!overallRating || !foodRating || !serviceRating || !selectedOption || !reviewText) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('star', overallRating);
        formData.append('foodRate', foodRating);
        formData.append('serviceRate', serviceRating);
        formData.append('type', selectedOption);
        formData.append('comment', reviewText);
        formData.append('userImage', userInfo.avatar || 'https://via.placeholder.com/50x50');
        formData.append('userName', userInfo.name || 'John Doe');
        formData.append('userID', userInfo._id || '123456789');
        
        // Append images to the form data
        imageFiles.forEach(file => {
            formData.append('images', file); // Append the actual file object
        });

        setIsLoading(true); // Set loading state to true

        try {
            const response = await fetch(url + '/api/review/create', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                alert('Review submitted successfully!');
                // Reset form fields
                setOverallRating(0);
                setFoodRating(0);
                setServiceRating(0);
                setImageFiles([]);
                setReviewText('');
                setSelectedOption(null);
                setShowPopup(false);
            } else {
                alert('Error submitting review: ' + data.message);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert('An error occurred while submitting your review. Please try again.');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div className='form-rating-popup'>
            <div className="form-rating-container">
                <h2>Rate Your Experience</h2>
                <div className="form-rating-user">
                    <img src={userInfo.avatar || 'https://via.placeholder.com/50x50'} alt='user' />
                    <div className='form-rating-user-info'>
                        <p>{userInfo.name || 'John Doe'}</p>
                        <p>Đăng công khai trên Fanpage</p>
                    </div>
                </div>

                {/* Overall rating */}
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

                {/* Food Quality rating */}
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

                {/* Service rating */}
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

                <textarea
                    className="rating-textarea"
                    placeholder='Nhập đánh giá'
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />

                {/* Button to add images */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="image-upload"
                />
                <label htmlFor="image-upload" className="add-image-btn">
                    Thêm ảnh
                </label>

                {/* Display selected images */}
                <div className="selected-images">
                    {imageFiles.map((file, index) => (
                        <div key={index} className="image-preview">
                            <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                            <button onClick={() => handleImageRemove(index)} className="remove-image-btn">X</button>
                        </div>
                    ))}
                </div>

                <div className="form-rating-actions">
                    <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
                    <button className="submit-btn" onClick={addReview} disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormRating;