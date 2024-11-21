import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import { useContext, useState } from 'react';
import FoodItem from '../FoodItem/FoodItem';
import PropTypes from 'prop-types';

const FoodDisplay = ({ category, wishlist }) => {
  const { food_list } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of items per page

  let filteredFoodList = [];
  if (wishlist && wishlist.length > 0) {
    // Filter food list by wishlist IDs
    filteredFoodList = food_list.filter(item => wishlist.includes(item._id));
  } else if (!wishlist) {
    // Filter food list by category
    filteredFoodList = food_list.filter(item => category === "All" || category === item.category);
  }

  // Pagination logic
  const totalItems = filteredFoodList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFoodList = filteredFoodList.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className='food-display' id='food-display'>
      <div >

      </div>
      <div className="food-display-list">
        {paginatedFoodList.length > 0 ? (
          paginatedFoodList.map((item, index) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired,
  wishlist: PropTypes.array,
};

export default FoodDisplay;
