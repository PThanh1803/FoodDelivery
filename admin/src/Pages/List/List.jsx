/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Add from '../Add/Add'; // Import the Add component for reuse

Modal.setAppElement('#root');

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/`);
      if (response.data.success) {
        setList(response.data.data);
        setFilteredList(response.data.data); // Set the filtered list initially as the full list
      } else {
        toast.error("Something went wrong, ERROR");
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  const filterByCategory = (category) => {
    setCategoryFilter(category);
    if (category === '') {
      setFilteredList(list); // If no category is selected, show the full list
    } else {
      const filtered = list.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()));
      setFilteredList(filtered);
    }
  };

  const openModal = (food) => {
    setSelectedFood(food);
    if (food) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFood(null);
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this food?")) {
      return;
    }
    try {
      const response = await axios.post(`${url}/api/food/${foodId}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Something went wrong, ERROR");
      }
    } catch (error) {
      toast.error("Failed to delete data");
    }
  };

  useEffect(() => {
    fetchList();
  }, [modalIsOpen]);

  return (
    <div className='list flex-col'>
      <h1>All Foods List</h1>

      {/* Search Bar for Category */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Category..."
          value={categoryFilter}
          onChange={(e) => filterByCategory(e.target.value)}
        />
      </div>

      <div className="card-container">
        <div className="card card-add" onClick={() => openModal(null)}>
          <p className="card-title">Add New Food</p>
          <IoMdAdd style={{ fontSize: '80px', color: '#09abe1' }} />
        </div>
        {filteredList.map((item, index) => (
          <div className="card" key={index} onClick={() => openModal(item)}>
            <img src={`${url}/images/` + item.image} alt="food" className="card-image" />
            <div className="card-content">
              <p className="card-title">{item.name}</p>
              <p className="card-category">{item.category}</p>
              <p className="card-description">{item.description}</p>
              <p className="card-price">${item.price}</p>
              <p className="card-action cursor" onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}>Delete</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Food Details"
        className="modal-food"
        overlayClassName="modal-food-overlay"
      >
        <Add url={url} foodData={selectedFood} isEditMode={isEditMode} closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default List;
