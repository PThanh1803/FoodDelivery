import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'
import FoodItem from '../FoodItem/FoodItem'
import PropTypes from 'prop-types';


const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext)
  console.log(food_list)
  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>


        <div className='food-display-list'>
            {food_list.map((item,index)=>{
              if(category === "All" || category === item.category){
                return (<FoodItem
                  key={index} 
                  id={item._id} 
                  name={item.name} 
                  price={item.price} 
                  description={item.description} 
                  image={item.image}  
                 />)
              }
                  
            })}
        </div>


    </div>
  )
}

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired, // or PropTypes.string if not required
};

export default FoodDisplay