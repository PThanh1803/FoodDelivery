import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './FoodDetails.css';
import { useNavigate } from 'react-router-dom';

const FoodDetails = () => {
    const { id } = useParams();
    const { food_list, cardItems, addToCard, removeFromCard, url } = useContext(StoreContext);
    const navigate = useNavigate();

    const foodItem = food_list.find(item => item._id === id);

    if (!foodItem) {
        return <p>Food not found!</p>;
    }

    const handleRemove = () => {
        if (cardItems[id] > 0) {
            removeFromCard(id);
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
                    <p>{cardItems[id] || 0}</p>
                    <button onClick={() => addToCard(id)}>+</button>
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
