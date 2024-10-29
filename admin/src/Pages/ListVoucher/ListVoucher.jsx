import { useState, useEffect } from 'react';
import './ListVoucher.css';
import AddVoucher from './AddVoucher/AddVoucher';  // Import the AddVoucherForm component
import axios from 'axios';
import { toast } from 'react-toastify';

// eslint-disable-next-line react/prop-types
const VoucherListPage = ({url}) => {
  const [vouchers, setVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [vouchersPerPage] = useState(1);  // Limit to 8 vouchers per page
  const [showPopup, setShowPopup] = useState(false);  // State for showing the popup
  const [selectedVoucher, setSelectedVoucher] = useState(null);  // To store selected voucher details for editing
  const [totalPages, setTotalPages] = useState(0);
  // Fetch vouchers when component mounts
 // useEffect with showPopup dependency to refresh the voucher list when popup closes
 const [reload, setReload] = useState(false);

 useEffect(() => {
   fetchVouchers();
 }, [showPopup, reload, url, currentPage, vouchersPerPage]);
 
 const closePopup = async () => {
   await fetchVouchers();
   setShowPopup(false);
   setReload(prev => !prev); 
 };
 


 const fetchVouchers = async () => {
  try {
    const response = await axios.get(`${url}/api/voucher/list`, {
      params: {
        page: currentPage,
        limit: vouchersPerPage,
        status: statusFilter,
        date: dateFilter,
        code: searchTerm,
      }
    });
    if (response.data.success) {
      setVouchers(response.data.vouchers);
      setTotalPages(response.data.pagination.totalPages); 
      console.log("Data:", response.data);
    } else {
      toast.error(response.data.message);
      setTotalPages(0);
    }
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    toast.error("Failed to fetch data");
  }
};
  
  


  const toggleVoucherStatus = (id) => {
    setVouchers(vouchers.map(voucher =>
      voucher.id === id
        ? { ...voucher, status: voucher.status === 'Active' ? 'Expired' : 'Active' }
        : voucher
    ));
  };

  // Open popup for adding a new voucher or viewing/editing an existing voucher
  const openPopup = (voucher) => {
    console.log("Selected Voucher:", voucher); // Add this for debugging
    setSelectedVoucher(voucher);  
    setShowPopup(true);
  };
  


  return (
    <div className="voucher-list">
      <h1>Voucher List</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by voucher code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option >All</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <button onClick={() => fetchVouchers()}>Filter</button>
      </div>

      {/* Add Voucher Button */}
      <div className="add-voucher">
        <button onClick={() => openPopup()}>+ Add New Voucher</button>
      </div>

      {/* Voucher Cards */}
      {totalPages === 0 && <p>No vouchers found</p>}
      {totalPages > 0 && <div className="voucher-cards">
        {vouchers.map((voucher) => (
          <div className="voucher-card" key={voucher.id}>
            <div className="voucher-details">
              <h3>{voucher.voucherCode}</h3>
              <p>{voucher.description}</p>
              <p>Discount: {voucher.discountAmount} {voucher.discountType === 'Percentage' ? '%' : 'VND'}</p>          
              <p>Start Date: {voucher.startDate.slice(0, 10).split('-').reverse().join('-')}</p>
              <p>Expiry Date: {voucher.expiryDate.slice(0, 10).split('-').reverse().join('-')}</p>
              <p>Status: {voucher.status}</p>
              <button onClick={() => toggleVoucherStatus(voucher.id)} className={voucher.status === 'Active' ? 'active' : 'inactive'}>
                {voucher.status === 'Active' ? 'Unactive' : 'Active'}
              </button>
              {/* View Details (opens the popup with voucher details) */}
              <button onClick={() => openPopup(voucher)}>View Details</button>
            </div>
            <img src={url + "/images/vouchers/" + voucher.image} alt={voucher.voucherCode} className="voucher-image" />
          </div>
        ))}
      </div>}

      {/* Phân trang */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? 'active-page' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Popup Modal for Add/Edit Voucher */}
      {showPopup && (
        <div className="modal">
          
            <AddVoucher voucher={selectedVoucher} isOpen={showPopup} closeModal={closePopup} url={url} />

        </div>
      )}
    </div>
  );
};

export default VoucherListPage;
