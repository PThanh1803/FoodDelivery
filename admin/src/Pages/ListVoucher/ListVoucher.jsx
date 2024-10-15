import { useState, useEffect } from 'react';
import './ListVoucher.css';
import AddVoucher from './AddVoucher/AddVoucher';  // Import the AddVoucherForm component

const VoucherListPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [vouchersPerPage] = useState(5);  // Limit to 8 vouchers per page
  const [showPopup, setShowPopup] = useState(false);  // State for showing the popup
  const [selectedVoucher, setSelectedVoucher] = useState(null);  // To store selected voucher details for editing

  // Fetch vouchers when component mounts
  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = () => {
    const dummyVouchers = [
        {
          id: 1,
          voucherCode: 'SAVE10',
          discountAmount: '10%',
          expiryDate: '2024-11-30',
          status: 'Active',
          description: 'Giảm giá 10% cho tất cả các đơn hàng từ 100,000 VNĐ.',
          image: 'https://via.placeholder.com/150',
          startDate: '2024-10-01',
          usageLimit: 100,  // Số lượt sử dụng tối đa
          minOrder: 50000,  // Đơn hàng tối thiểu
          maxDiscount: 20000,  // Giảm giá tối đa
        },
        {
          id: 2,
          voucherCode: 'SUMMER25',
          discountAmount: '25%',
          expiryDate: '2024-08-31',
          status: 'Expired',
          description: 'Giảm giá 25% cho các đơn hàng mùa hè từ 200,000 VNĐ.',
          image: 'https://via.placeholder.com/150',
          startDate: '2024-06-01',
          usageLimit: 200,
          minOrder: 200000,
          maxDiscount: 50000,
        },
        {
          id: 3,
          voucherCode: 'FREESHIP',
          discountAmount: 'Free Shipping',
          expiryDate: '2024-12-15',
          status: 'Active',
          description: 'Miễn phí giao hàng cho các đơn hàng trên 150,000 VNĐ.',
          image: 'https://via.placeholder.com/150',
          startDate: '2024-09-01',
          usageLimit: 50,
          minOrder: 150000,
          maxDiscount: 0,  // Không có giảm giá tối đa
        },
        {
          id: 4,
          voucherCode: 'XMAS30',
          discountAmount: '30%',
          expiryDate: '2024-12-25',
          status: 'Active',
          description: 'Giảm giá 30% cho các đơn hàng giáng sinh từ 300,000 VNĐ.',
          image: 'https://via.placeholder.com/150',
          startDate: '2024-12-01',
          usageLimit: 300,
          minOrder: 300000,
          maxDiscount: 90000,
        },
        {
          id: 5,
          voucherCode: 'WINTER15',
          discountAmount: '15%',
          expiryDate: '2024-01-15',
          status: 'Expired',
          description: 'Giảm giá 15% cho các sản phẩm mùa đông từ 100,000 VNĐ.',
          image: 'https://via.placeholder.com/150',
          startDate: '2023-12-01',
          usageLimit: 150,
          minOrder: 100000,
          maxDiscount: 30000,
        },
      ];
    // Replace with API call to fetch vouchers
    setVouchers(dummyVouchers);
  };

  // Handle filter logic
  const filteredVouchers = vouchers.filter((voucher) => {
    return (
      (statusFilter === 'All' || voucher.status === statusFilter) &&
      (searchTerm === '' || voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (dateFilter === '' || new Date(voucher.expiryDate) >= new Date(dateFilter))
    );
  });

  // Pagination logic
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = filteredVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
  

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedVoucher(null);  // Clear selected voucher when closing the popup
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
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Add Voucher Button */}
      <div className="add-voucher">
        <button onClick={() => openPopup()}>+ Add New Voucher</button>
      </div>

      {/* Voucher Cards */}
      <div className="voucher-cards">
        {currentVouchers.map((voucher) => (
          <div className="voucher-card" key={voucher.id}>
            <div className="voucher-details">
              <h3>{voucher.voucherCode}</h3>
              <p>{voucher.description}</p>
              <p>Discount: {voucher.discountAmount}</p>
              <p>Expiry Date: {voucher.expiryDate}</p>
              <p>Status: {voucher.status}</p>
              <button onClick={() => toggleVoucherStatus(voucher.id)} className={voucher.status === 'Active' ? 'active' : 'inactive'}>
                {voucher.status === 'Active' ? 'Unactive' : 'Active'}
              </button>
              {/* View Details (opens the popup with voucher details) */}
              <button onClick={() => openPopup(voucher)}>View Details</button>
            </div>
            <img src={voucher.image} alt={voucher.voucherCode} className="voucher-image" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredVouchers.length / vouchersPerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      {/* Popup Modal for Add/Edit Voucher */}
      {showPopup && (
        <div className="modal">
          
            <AddVoucher voucher={selectedVoucher} isOpen={showPopup} closeModal={closePopup} />

        </div>
      )}
    </div>
  );
};

export default VoucherListPage;
