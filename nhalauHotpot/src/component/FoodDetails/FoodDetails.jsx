import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './FoodDetails.css';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { toast } from 'react-toastify';

const FoodDetails = () => {
    const { food_list, cardItems, addToCard, removeFromCard, url, userInfo } = useContext(StoreContext);
    const navigate = useNavigate();
    const { id } = useParams(); // Call useParams at the top level of the component
    const [wishlist, setWishlist] = useState([]);
    const [foodItem, setFoodItem] = useState(null);
    useEffect(() => {
        window.scrollTo(0, 0);

        // Decrypt the ID
        const decryptedID = CryptoJS.AES.decrypt(id, 'secret-key').toString(CryptoJS.enc.Utf8);
        setFoodItem(food_list.find(item => item._id === decryptedID));
        fetchWishlist();
    }, [id, food_list, userInfo]); // Add dependencies to avoid unnecessary re-renders
    const fetchWishlist = async () => {
        try {
            if (!userInfo || !userInfo._id) {
                console.error('Invalid userInfo or userInfo._id');
                return;
            }

            const response = await fetch(`${url}/api/wishlist/${userInfo._id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }

            const data = await response.json();

            if (data.success) {
                setWishlist(data.wishlist);
            } else {
                console.error('Failed to fetch wishlist:', data.message || 'Unknown error');
            }
        } catch (error) {
            // Log any errors
            console.error('Error fetching wishlist:', error);
        }
    };

    const addToWishlist = async () => {
        try {
            const response = await axios.post(`${url}/api/wishlist`, {
                userId: userInfo._id,
                itemId: foodItem._id,
            });
            if (response.data.success) {
                setWishlist([...wishlist, foodItem._id]);
                toast.success('Đã thêm vào wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error('Có lỗi xảy ra khi thêm vào wishlist');
        }
    };

    const removeFromWishlist = async () => {
        try {
            const response = await fetch(`${url}/api/wishlist/${foodItem._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userInfo._id,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setWishlist(wishlist.filter(item => item !== foodItem._id));
                toast.success('Đã xóa khỏi wishlist');
            }
            else {
                toast.error('Có lỗi xảy ra khi xóa khỏi wishlist');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Có lỗi xảy ra khi xóa khỏi wishlist');
        }
    };
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

                <button
                    className='wishlist-button'
                    onClick={wishlist.includes(foodItem._id) ? removeFromWishlist : addToWishlist}
                >
                    {wishlist.includes(foodItem._id) ? 'Xóa khỏi wishlist' : 'Thêm vào wishlist'}
                </button>

            </div>
        </div>
    );
};

export default FoodDetails;
