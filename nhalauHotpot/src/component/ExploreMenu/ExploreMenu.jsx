import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
import PropTypes from 'prop-types';
import { StoreContext } from '../../Context/StoreContext';
import React, { useEffect } from 'react';
import axios from 'axios';
import FoodItem from '../FoodItem/FoodItem';
const ExploreMenu = ({ category, setCategory }) => {
  const [bestSellers, setBestSellers] = React.useState([]);
  const { url } = React.useContext(StoreContext);

  console.log(bestSellers);
  const fetchBestSellers = async () => {
    try {
      // Step 1: Fetch bestseller IDs
      const response = await axios.get(`${url}/api/order/topseller`);
      if (response.data.success) {
        const totalSoldMap = new Map()
        const bestSellerIds = response.data.topItems.map(item => item._id);
        response.data.topItems.forEach(item => {
          totalSoldMap.set(item._id, item.totalSold);
        });
        // Log the bestseller IDs to
        const foodResponse = await axios.get(`${url}/api/food/topseller`, {
          params: { ids: bestSellerIds }, // Use params to send query parameters
        });
        if (foodResponse.data.success) {
          const bestSellersData = foodResponse.data.data.map(foodItem => ({
            ...foodItem,
            totalSold: totalSoldMap.get(foodItem._id) || 0, // Add totalSold to each item
          }));
          bestSellersData.sort((a, b) => b.totalSold - a.totalSold);
          setBestSellers(bestSellersData);
          // Set the full food data in state
        } else {
          console.error("Failed to fetch food details");
        }
      } else {
        console.error("Failed to fetch bestseller IDs");
      }
    } catch (error) {
      console.error("Error fetching bestsellers:", error);
    }
  };
  // Fetch bestseller list on component mount
  useEffect(() => {


    fetchBestSellers();
  }, []);
  return (
    <div className='explore-menu ' id='explore-menu'>
      <h1 className='explore-menu-title'> BEST SELLER</h1>
      <div className='explore-best-seller'>
        {bestSellers.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
            totalSold={item.totalSold}
          />))}

      </div>
      <div className='more'>
        <a href='/menu'>More Foods</a>
      </div>
    </div>
  )
}

ExploreMenu.propTypes = {
  category: PropTypes.string.isRequired, setCategory: PropTypes.string.isRequired // or PropTypes.string if not required
};

export default ExploreMenu