import React from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
// eslint-disable-next-line react/prop-types
const FoodItem = ({ id, name, price, description, image }) => {

    const { cardItems, addToCard, removeFromCard, url } = React.useContext(StoreContext);
    const navigate = useNavigate();


    const handleClick = () => {
        const encryptedID = CryptoJS.AES.encrypt(id, 'secret-key').toString();
        navigate(`/menu/${encryptedID}`, { state: { id, name, price, description, image } }); // Điều hướng đến trang FoodDetails với id của món ăn
    };
    return (
        <div className='food-item' id='food-item' onClick={handleClick}> {/* Thêm onClick */}
            <div className='food-item-img-container'>
                <img className='food-item-image' src={url + "/images/" + image} alt="food" />
                {!cardItems[id] ? (
                    <img className='add' src={assets.add_icon_white} alt="add" onClick={(e) => { e.stopPropagation(); addToCard(id); }} />
                ) : (
                    <div className='food-item-counter'>
                        <img src={assets.remove_icon_red} alt='' onClick={(e) => { e.stopPropagation(); removeFromCard(id); }} />
                        <p>{cardItems[id]}</p>
                        <img src={assets.add_icon_green} alt='' onClick={(e) => { e.stopPropagation(); addToCard(id); }} />
                    </div>
                )}
            </div>
            <div className='food-item-info'>
                <div className='food-item-name-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="rating" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">$ {price}</p>
            </div>
        </div>
    );
}

export default FoodItem