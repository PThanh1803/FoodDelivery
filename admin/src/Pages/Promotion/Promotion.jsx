import React, { useState, useEffect } from 'react';
import './Promotion.css';
import PromotionForm from './PromotionForm/PromotionForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
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

const Promotions = ({url}) => {
  const [promotions, setPromotions] = useState(promotionsData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [modalType, setModalType] = useState(''); // add, edit, or details

  const fetchPromotions = async () => {
    try {
      const response = await axios.get(url +'/api/promotion/list');
      if(response.data.success) {
        const formattedPromotions = response.data.promotions.map(promotion => ({
          ...promotion,
          dateCreated: new Date(promotion.dateCreated).toISOString().split('T')[0],
          startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : "", // Set to empty string if null or invalid
          expiryDate: promotion.expiryDate ? new Date(promotion.expiryDate).toISOString().split('T')[0] : "", // Set to empty string if null or invalid
        }));

        setPromotions(formattedPromotions);
        
      }
      else {
        console.error('Error fetching promotions:', response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch promotions');
      console.error('Error fetching promotions:');
    }
  }

  useEffect(() => {
    fetchPromotions();
  }, [url]);


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

  const handleFormSubmit = async (newPromotion) => {
    const formData = new FormData();
    formData.append('image', newPromotion.image);
    formData.append('title', newPromotion.title);
    formData.append('dateCreated', newPromotion.dateCreated);
    formData.append('expiryDate', newPromotion.expiryDate);
    formData.append('startDate', newPromotion.startDate);
    formData.append('status', newPromotion.status);
    formData.append('description', newPromotion.description);
    formData.append('content', newPromotion.content);
    if (modalType === 'add') {
      try {
        console.log("newPromotion: ", newPromotion);
      
        const response = await axios.post(url +'/api/promotion/create', formData);
        if (response.data.success) {
          toast.success('Promotion added successfully');
          fetchPromotions();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Failed to add promotion');
        console.error('Error adding promotion:');
      }
      setPromotions([...promotions, { ...newPromotion }]);
    }
     else if (modalType === 'edit') {
      try {
        formData.append('id', currentPromotion._id);
        const response = await axios.put(url +'/api/promotion/update', formData);
        if (response.data.success) {
          toast.success('Promotion updated successfully');
          fetchPromotions();
        } else {
          toast.error(response.data.message);
        }
      }
      catch (error) {
        toast.error('Failed to update promotion');
        console.error('Error updating promotion:');
      }
      setPromotions(promotions.map(p => p._id === currentPromotion._id ? newPromotion : p));
    }
    setIsModalVisible(false);
  };

  if (promotions=== null) {
    return <div className="promotions-container"><h1>Loading...</h1></div>;
  }

  return (
    <div className="promotions-container">
      <h1>Promotion</h1>
      <button className="add-btn" onClick={handleAddPromotion}>
        + Thêm Khuyến Mãi
      </button>
      {promotions.length === 0 && <p>Không có khuyến mãi nào</p>}
      {promotions.length > 0 && <ul>
        {promotions.map((promo) => (
          <li key={promo.id} className="promotion-item">
            <img src={url + '/images/promotions/' + promo.image} alt={promo.title} />
            <div className="promotion-details">
              <div> <h3>{promo.title}</h3> <p>Ngày đăng: {promo.dateCreated}</p></div>
              <p>{promo.date}</p>
              <p>{promo.description}</p>
              <div className="action-buttons">
                <button className="edit-btn" onClick={() => handleEditPromotion(promo)}>Edit</button>
                <button className="details-btn" onClick={() => handleViewDetails(promo)}>Chi tiết</button>
              </div>
            </div>
          </li>
        ))}
      </ul>}

      <PromotionForm
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={currentPromotion}
        modalType={modalType}
        url={url}
      />
    </div>
  );
};

export default Promotions;
