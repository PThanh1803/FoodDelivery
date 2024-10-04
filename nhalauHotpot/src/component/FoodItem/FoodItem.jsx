import React from 'react'
import './FoodItem.css'
import {assets} from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'

// eslint-disable-next-line react/prop-types
const FoodItem = ({id, name,  price, description, image}) => {

    const {cardItems,addToCard,removeFromCard,url } = React.useContext(StoreContext);

  return (
    <div className='food-item' id='food-item'>
        <div className='food-item-img-container'>
            <img className='food-item-image' src={url+"/images/"+image} alt="food" />
            {!cardItems[id]
                ?<img className='add' src={assets.add_icon_white} alt="add" onClick={() => addToCard(id)}/>
                :<div className='food-item-counter'>
                    <img src={assets.remove_icon_red} alt='' onClick={() => removeFromCard(id)}/>
                    <p>{cardItems[id]}</p>
                    <img src={assets.add_icon_green} alt='' onClick={() => addToCard(id)}/>
                </div>
            }
        </div>
        <div className='food-item-info'>
            <div className='food-item-name-rating'>
                <p>{name}</p>
                <img src={assets.rating_starts} alt="rating"/>
            </div>
            <p className="food-item-desc">{description}</p>
            <p className="food-item-price">$ {price}</p>

        </div>
     
       
    </div>
  )
}

export default FoodItem