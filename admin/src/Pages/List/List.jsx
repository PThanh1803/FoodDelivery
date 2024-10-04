import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Đảm bảo cấu hình đúng với root element của ứng dụng

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [foodIdToDelete, setFoodIdToDelete] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Something went wrong, ERROR");
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  const openModal = (foodId) => {
    setFoodIdToDelete(foodId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFoodIdToDelete(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${url}/api/food/remove/`, { id: foodIdToDelete });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Something went wrong, ERROR");
      }
      closeModal();
    } catch (error) {
      toast.error("Failed to delete data");
      closeModal();
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div className="list-table-format" key={index}>
            <img src={`${url}/images/` + item.image} alt="food" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p className="cursor" onClick={() => openModal(item._id)}>X</p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Xác nhận xóa dữ liệu"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Xác nhận</h2>
        <p>Bạn có muốn xóa dữ liệu này không?</p>
        <div className="modal-buttons">
          <button className="modal-button modal-button-confirm" onClick={handleDelete}>OK</button>
          <button className="modal-button modal-button-cancel" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default List;
