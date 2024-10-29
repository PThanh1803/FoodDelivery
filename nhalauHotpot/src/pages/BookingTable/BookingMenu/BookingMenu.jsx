import React, { useState, useContext } from 'react';
import './BookingMenu.css'; // Import custom styles
import { menu_list } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext';

const BookingMenu = ({ onFoodSelect }) => {
  const { food_list, url } = useContext(StoreContext); // Get food list from context
  const [category, setCategory] = useState('All');
  const [selectedFoods, setSelectedFoods] = useState({});

  // Handle food selection and quantity update
  const handleFoodSelect = (food, quantity) => {
    setSelectedFoods((prev) => ({
      ...prev,
      [food._id]: { ...food, quantity: Number(quantity) }, // Store selected food with quantity
    }));

    console.log(selectedFoods);
  };

  // Open food details in a new tab
  const handleFoodClick = (foodId) => {
    const newTab = window.open(`/menu/${foodId}`, '_blank'); // Open in a new tab
    if (newTab) newTab.focus(); // Focus on the new tab
  };

  // Filter foods by category
  const filteredFoods = category === 'All'
    ? food_list
    : food_list.filter((food) => food.category === category);
    
  return (
    <div className="booking-menu-container">
      <h2>Chọn Món</h2>
      <div className="menu-categories">
        <button
          className={`menu-category-btn ${category === 'All' ? 'active' : ''}`}
          onClick={() => setCategory('All')}
        >
          All
        </button>
        {menu_list.map((item, index) => (
          <button
            key={index}
            className={`menu-category-btn ${category === item.menu_name ? 'active' : ''}`}
            onClick={() => setCategory(item.menu_name)}
          >
            {item.menu_name}
          </button>
        ))}
      </div>

      <div className="food-list">
        {filteredFoods.map((food) => (
          <div key={food._id} className="food-item">
            <img
              src={`${url}/images/${food.image}`}
              alt={food.name}
              onClick={() => handleFoodClick(food._id)} // Move the click handler to the image
            />
            <div className="food-info">
              <h3>{food.name}</h3>
              <p>{food.price} VND</p>
              <div className="food-quantity">
                <label htmlFor={`quantity-${food._id}`}>Số lượng:</label>
                <input
                  type="number"
                  id={`quantity-${food._id}`}
                  min="1"
                  defaultValue="1"
                  onChange={(e) => handleFoodSelect(food, e.target.value)}
                  onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
                />
              </div>
              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from triggering the food item click
                  const selectedFood = selectedFoods[food._id] || { ...food, quantity: 1 };
                  onFoodSelect(selectedFood);
                }}
              >
                Thêm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingMenu;
