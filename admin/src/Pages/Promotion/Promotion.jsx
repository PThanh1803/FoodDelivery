import React, { useState, useEffect } from 'react';
import './Promotion.css';
import PromotionForm from './PromotionForm/PromotionForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Promotions = ({ url }) => {
  const [promotions, setPromotions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [modalType, setModalType] = useState(''); // add, edit, or details
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPromotions = async (currentPage) => {
    try {
      const response = await axios.get(`${url}/api/promotion/list?page=${currentPage}&limit=5`);
      if (response.data.success) {
        setPromotions(response.data.promotions);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch promotions');
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions(page);
  }, [url, page]);

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

  const handleDelete = async (promo) => {
    try {
      const response = await axios.delete(`${url}/api/promotion/delete/${promo._id}`);
      if (response.data.success) {
        toast.success('Promotion deleted successfully');
        fetchPromotions(page); // Refresh promotions list after deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to delete promotion');
      console.error('Error deleting promotion:', error);
    }
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
        const response = await axios.post(`${url}/api/promotion/create`, formData);
        if (response.data.success) {
          toast.success('Promotion added successfully');
          fetchPromotions(page); // Refresh after adding
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Failed to add promotion');
        console.error('Error adding promotion:', error);
      }
    } else if (modalType === 'edit') {
      try {
        formData.append('id', currentPromotion._id);
        const response = await axios.put(`${url}/api/promotion/update`, formData);
        if (response.data.success) {
          toast.success('Promotion updated successfully');
          fetchPromotions(page); // Refresh after update
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Failed to update promotion');
        console.error('Error updating promotion:', error);
      }
    }
    setIsModalVisible(false);
  };

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
                <button className="edit-btn" onClick={() => handleDelete(promo)}>Xóa</button>
              </div>
            </div>
          </li>
        ))}
      </ul>}

      {/* Pagination */}
      <div className="pagination-controls">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>

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
