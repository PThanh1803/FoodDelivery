/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { IoMdAdd } from "react-icons/io";
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
  }, [fetchList]);

  return (
    <div className='list add flex-col'>
      <h2>All Foods List</h2>
      <div className="card-container">
          <div className="card card-add" onClick={() => window.location.href = '/add'}>             
            <p className="card-title">Add New Food</p>
            <IoMdAdd style={{fontSize: '80px', color: '#09abe1'}}/>
          </div>
        {list.map((item, index) => (
          <div className="card" key={index}>
            <img src={`${url}/images/` + item.image} alt="food" className="card-image" />
            <div className="card-content">
              <p className="card-title">{item.name}</p>
              <p className="card-category">{item.category}</p>
              <p className="card-price">${item.price}</p>
              <p className="card-action cursor" onClick={() => openModal(item._id)}>Delete</p>
            </div>
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
        <div className="modal-content">
          <h2>Xác nhận</h2>
          <p>Bạn có muốn xóa dữ liệu này không?</p>
          <div className="modal-buttons">
            <button className="modal-button modal-button-confirm" onClick={handleDelete}>OK</button>
            <button className="modal-button modal-button-cancel" onClick={closeModal}>Cancel</button>
          </div>
        </div>
        
      </Modal>
    </div>
  );
};

export default List;
