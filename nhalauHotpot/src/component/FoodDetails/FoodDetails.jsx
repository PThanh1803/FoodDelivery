import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './FoodDetails.css';
import { useNavigate } from 'react-router-dom';

const FoodDetails = () => {
    const { id } = useParams();
    const { food_list, cardItems, addToCard, removeFromCard, url } = useContext(StoreContext); // Lấy danh sách món ăn, cardItems, addToCard và removeFromCard từ context

    const navigate = useNavigate();
    // Tìm món ăn có id tương ứng
    const foodItem = food_list.find(item => item._id === id);

    if (!foodItem) {
        return <p>Food not found!</p>;
    }

    // Hàm giảm số lượng món ăn nhưng không để giá trị nhỏ hơn 0
    const handleRemove = () => {
        if (cardItems[id] > 0) {
            removeFromCard(id); // Chỉ cho phép giảm nếu số lượng lớn hơn 0
        }
    };
    const handleClick = () => {
        navigate(`/card`);
    }
    return (
        <div className='food-details-container'>
            <img src={`${url}/images/${foodItem.image}`} alt={foodItem.name} /> {/* Sử dụng url để tạo đường dẫn */}
            <div className='food-details-info'>
                <div className='food-details-title'>
                    <h1>{foodItem.name}</h1>
                    <div>★★★★★</div>
                </div>
                <div className='food-details-description'>
                    <p>{foodItem.description}</p>
                    <h3>Price: ${foodItem.price}</h3>
                </div>

                {/* Thêm phần số lượng với các nút - 0 + */}
                <div className='food-details-counter'>
                    <button onClick={handleRemove}>-</button> {/* Giảm số lượng, không cho phép giá trị âm */}
                    <p>{cardItems[id] || 0}</p> {/* Hiển thị số lượng đã thêm vào giỏ hàng */}
                    <button onClick={() => addToCard(id)}>+</button> {/* Tăng số lượng */}
                </div>

                {/* Nút Đặt Món */}
                <button className='order-button' onClick={handleClick}>Đặt món</button>
                <button className='wishlist-button' >Thêm vào Wishlist</button>
            </div>
        </div>
    );
};

export default FoodDetails;
