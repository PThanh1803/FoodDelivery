import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './FoodDetails.css';
import CryptoJS from 'crypto-js';

const FoodDetails = () => {
    const { food_list, cardItems, addToCard, removeFromCard, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const { id } = useParams(); // Call useParams at the top level of the component

    const [foodItem, setFoodItem] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);      

        // Decrypt the ID
        const decryptedID = CryptoJS.AES.decrypt(id, 'secret-key').toString(CryptoJS.enc.Utf8);
        setFoodItem(food_list.find(item => item._id === decryptedID));
    }, [id, food_list]); // Add dependencies to avoid unnecessary re-renders

    if (!foodItem) {
        return <p>Food not found!</p>;
    }

    const handleRemove = () => {
        if (cardItems[foodItem._id] > 0) {
            removeFromCard(foodItem._id);
        }
    };

    const handleClick = () => {
        navigate(`/card`);
    };

    return (
        <div className='food-details-container'>
            <img src={`${url}/images/${foodItem.image}`} alt={foodItem.name} />
            <div className='food-details-info'>
                <div className='food-details-title'>
                    <h1>{foodItem.name}</h1>
                    <div>★★★★★</div>
                </div>
                <div className='food-details-description'>
                    <p>{foodItem.description}</p>
                    <h3>Price: ${foodItem.price}</h3>
                </div>

                <div className='food-details-counter'>
                    <button onClick={handleRemove}>-</button>
                    <p>{cardItems[foodItem._id] || 0}</p>
                    <button onClick={() => addToCard(foodItem._id)}>+</button>
                </div>

                <button className='order-button' onClick={handleClick}>Đặt món</button>
                <button className='wishlist-button'>
                    Thêm vào wishlist
                </button>
            </div>
        </div>
    );
};

export default FoodDetails;
