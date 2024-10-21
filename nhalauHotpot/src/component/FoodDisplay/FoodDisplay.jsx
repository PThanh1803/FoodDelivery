import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'
import FoodItem from '../FoodItem/FoodItem'
import PropTypes from 'prop-types';


const FoodDisplay = ({ category, wishlist }) => {
  const { food_list } = useContext(StoreContext)
  let filteredFoodList = [];
  if (wishlist && wishlist.length > 0) {
    // Nếu có wishlist, lọc danh sách món ăn theo ID trong wishlist
    filteredFoodList = food_list.filter(item => wishlist.includes(item._id));
  } else if (!wishlist) {
    // Nếu không có wishlist (tức là đang gọi từ menu), lọc theo category
    filteredFoodList = food_list.filter(item => category === "All" || category === item.category);
  }
  console.log(food_list)
  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-list">
        {filteredFoodList.length > 0 ? (
          filteredFoodList.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))
        ) : (
          <p>No dishes available.</p>
        )}
      </div>
    </div>

  )
}

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired, // or PropTypes.string if not required
};

export default FoodDisplay