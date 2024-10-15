import React, { useState } from 'react'
import "./Menu.css"
import { menu_list } from '../../assets/assets'
import PropTypes from 'prop-types';
import FoodDisplay from '../../component/FoodDisplay/FoodDisplay';

const Menu = () => {
    const [category, setCategory] = useState('All')

    return (
        <div className='menu-container'>
            <div className='menu'>
                <div className='menu-header'>
                    <h1>Menu</h1>
                </div><hr className='menu-divider' />
                <div className='menu-list'>
                    {menu_list.map((item, index) => (
                        <div
                            onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)}
                            className='menu-list-item'
                            key={index}
                        >
                            <p className={category === item.menu_name ? 'active' : ''}>{item.menu_name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='food-display'>
                <FoodDisplay category={category} />
            </div>
        </div>
    )
}

Menu.propTypes = {
    category: PropTypes.string.isRequired,
    setCategory: PropTypes.func.isRequired
};

export default Menu;
