import React, { useState } from 'react';
import './Promotion.css';
import PromotionForm from './PromotionForm/PromotionForm';

const promotionsData = [
  {
    id: 1,
    title: 'ƯU ĐÃI SINH NHẬT DÀNH RIÊNG CHO THÀNH VIÊN HẠNG DIAMOND',
    date: '2024-08-30 04:30:40',
    description: 'Tặng gói trang trí sinh nhật 2.000.000đ & -20% menu đồ ăn',
    content: '<p>Tặng ưu đãi tuyệt vời dành riêng cho bạn...</p>',
    image: 'url-to-image1',
  },
  {
    id: 2,
    title: 'QUÀ TẶNG SINH NHẬT DÀNH RIÊNG CHO THÀNH VIÊN HẠNG VÀNG',
    date: '2024-06-13 15:45:50',
    description: 'Tặng gói trang trí sinh nhật 2.000.000đ & -15% menu đồ ăn',
    content: '<p>Nhiều ưu đãi hấp dẫn...</p>',
    image: 'url-to-image2',
  },
  // Thêm các mục khuyến mãi khác...
];

const Promotions = () => {
  const [promotions, setPromotions] = useState(promotionsData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [modalType, setModalType] = useState(''); // add, edit, or details

  const handleAddPromotion = () => {
    setModalType('add');
    setCurrentPromotion(null);
    setIsModalVisible(true);
  };

  const handleEditPromotion = (promo) => {
    setModalType('edit');
    setCurrentPromotion(promo);
    setIsModalVisible(true);
  };

  const handleViewDetails = (promo) => {
    setModalType('details');
    setCurrentPromotion(promo);
    setIsModalVisible(true);
  };

  const handleFormSubmit = (newPromotion) => {
    if (modalType === 'add') {
      setPromotions([...promotions, { ...newPromotion, id: promotions.length + 1 }]);
    } else if (modalType === 'edit') {
      setPromotions(promotions.map(p => p.id === currentPromotion.id ? newPromotion : p));
    }
    setIsModalVisible(false);
  };

  return (
    <div className="promotions-container">
      <h1>Promotion</h1>
      <button className="add-btn" onClick={handleAddPromotion}>
        + Thêm Khuyến Mãi
      </button>

      <ul>
        {promotions.map((promo) => (
          <li key={promo.id} className="promotion-item">
            <img src={promo.image} alt={promo.title} />
            <div className="promotion-details">
              <h3>{promo.title}</h3>
              <p>{promo.date}</p>
              <p>{promo.description}</p>
              <div className="action-buttons">
                <button className="edit-btn" onClick={() => handleEditPromotion(promo)}>Edit</button>
                <button className="details-btn" onClick={() => handleViewDetails(promo)}>Chi tiết</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <PromotionForm
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={currentPromotion}
        modalType={modalType}
      />
    </div>
  );
};

export default Promotions;
