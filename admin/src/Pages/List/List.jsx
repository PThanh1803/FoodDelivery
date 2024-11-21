/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './List.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { IoMdAdd } from "react-icons/io";
import Add from '../Add/Add'; // Import the Add component for reuse
import ApiClient from '../../client';

Modal.setAppElement('#root');

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Số lượng mục trên mỗi trang

  const categories = ["All", "Salad", "Rolls", "Desserts", "Sandwich", "Cake", "Pasta"];

  const fetchList = async () => {
    const client = new ApiClient("food");
    const response = await client.find();
    if (response.data.success) {
      setList(response.data.data);
      setFilteredList(response.data.data); // Set the filtered list initially as the full list
    } else {
      toast.error("Something went wrong, ERROR");
    }
  };

  const filterByCategory = (category) => {
    setCurrentPage(1); // Reset về trang đầu tiên khi chọn danh mục
    if (category === "All") {
      setFilteredList(list); // Hiển thị toàn bộ danh sách nếu không chọn danh mục
    } else {
      const filtered = list.filter((item) => item.category === category);
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

  useEffect(() => {
    fetchList();
  }, [modalIsOpen]);

  // Tính toán các mục hiển thị cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  return (
    <div className='list flex-col'>
      <h1>All Foods List</h1>

      {/* Category Cards */}
      <div className="category-container">
        {categories.map((category) => (
          <div
            key={category}
            className="category-card"
            onClick={() => filterByCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>

      {/* Food Cards */}
      <div className="card-container">
        <div className="card card-add" onClick={() => openModal(null)}>
          <p className="card-title">Add New Food</p>
          <IoMdAdd style={{ fontSize: '80px', color: '#09abe1' }} />
        </div>
        {paginatedList.map((item, index) => (
          <div className="card" key={index} onClick={() => openModal(item)}>
            <img src={`${url}/images/` + item.image} alt="food" className="card-image" />
            <div className="card-content">
              <p className="card-title">{item.name}</p>
              <p className="card-category">{item.category}</p>
              <p className="card-description">{item.description}</p>
              <p className="card-price">${item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || filteredList.length === 0}
        >
          Next
        </button>
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
