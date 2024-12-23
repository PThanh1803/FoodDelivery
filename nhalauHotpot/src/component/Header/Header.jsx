import './Header.css';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import CryptoJS from 'crypto-js';

const Header = () => {
  const { url } = useContext(StoreContext);
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchListPromotion = async () => {
    try {
      const response = await axios.get(`${url}/api/promotion?page=1&limit=10&status=active`);
      if (response.data.success) {
        setPromotions(response.data.promotions);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListPromotion();
  }, []);

  // Tự động chuyển ảnh sau mỗi 7 giây
  useEffect(() => {
    if (promotions.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
      }, 7000);

      return () => clearInterval(interval);
    }
  }, [promotions]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? promotions.length - 1 : prevIndex - 1
    );
  };

  const handlePromoClick = (promoId) => {
    const encryptedID = encodeURIComponent(
      CryptoJS.AES.encrypt(promoId, 'secret-key').toString()
    );
    window.location.href = `/promotions/${encryptedID}`;
  };

  return (
    <div className="header">
      <div className="header-img">
        {promotions.map((promo, index) => (
          <img
            key={index}
            src={`${url}/images/promotions/${promo.image}`}
            alt={promo.title || `Promotion ${index + 1}`}
            className={`promotion-image ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              if (index === currentIndex) handlePromoClick(promo._id);
            }} // Chỉ xử lý click khi là hình đang hiển thị
          />
        ))}
        <button onClick={handlePrev} className="prev-button">❮</button>
        <button onClick={handleNext} className="next-button">❯</button>
      </div>
    </div>
  );
};

export default Header;
