import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
import PropTypes from 'prop-types';
const ExploreMenu = ({category ,setCategory}) => {
  return (
    <div className='explore-menu ' id='explore-menu'>
        <h1>Explore Menu</h1>
        <p className='explore-menu-text'>Chose from a diverted selection of dishes to suit your taste and occasion. Our </p>   
        <div className='explore-menu-list'>
            {menu_list.map((item,index)=>(
                <div 
                  onClick={()=>setCategory(prev=>prev===item.menu_name ? 'All' : item.menu_name)} 
                  className='explore-menu-list-item' 
                  key={index}
                >
                    <img src={item.menu_image} alt="menu" className={category===item.menu_name ? 'active' : ''} />
                    <p>{item.menu_name}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

ExploreMenu.propTypes = {
  category: PropTypes.string.isRequired,setCategory: PropTypes.string.isRequired // or PropTypes.string if not required
};

export default ExploreMenu