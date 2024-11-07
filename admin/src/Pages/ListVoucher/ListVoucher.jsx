import { useState, useEffect } from 'react';
import './ListVoucher.css';
import AddVoucher from './AddVoucher/AddVoucher';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaClipboard } from 'react-icons/fa'; // Import FaClipboard from react-icons


const VoucherListPage = ({ url }) => {
  const [vouchers, setVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [vouchersPerPage] = useState(2);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [copiedVoucherCode, setCopiedVoucherCode] = useState(null); // Track copied code
  const [copied, setCopied] = useState(false); // Track if the code was copied

  // Function to copy the voucher code
  const copyToClipboard = (voucherCode) => {
    navigator.clipboard.writeText(voucherCode);
    setCopiedVoucherCode(voucherCode); // Set the copied voucher code
    setCopied(true); // Set the copied flag to true
    toast.success("Voucher code copied to clipboard!");

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
      setCopiedVoucherCode(null);
    }, 2000);
  };

  useEffect(() => {
    fetchVouchers();
  }, [showPopup, url, currentPage, vouchersPerPage]);

  const closePopup = async () => {
    await fetchVouchers();
    setShowPopup(false);
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
      } else {
        toast.error(response.data.message);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Failed to fetch data");
    }
  };



  const openPopup = (voucher) => {
    setSelectedVoucher(voucher);
    setShowPopup(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const isVoucherExpired = (expiryDate) => new Date(expiryDate) < new Date();

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
          <option>All</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button className="filter-button" onClick={() => fetchVouchers()}>Filter</button>
      </div>

      {/* Add Voucher Button */}
      <div className="add-voucher">
        <button onClick={() => openPopup(null)}>+ Add New Voucher</button>
      </div>

      {/* Voucher Cards */}
      {totalPages === 0 && <p>No vouchers found</p>}
      {totalPages > 0 && (
        <div className="voucher-cards">
          {vouchers.map((voucher) => {
            const isExpired = isVoucherExpired(voucher.expiryDate);
            const isUsageLimitReached = voucher.used >= voucher.usageLimit;
            const overlayText = isExpired
              ? "Đã hết hạn"
              : isUsageLimitReached
              ? "Hết lượt sử dụng"
              : voucher.status === "Expired" ? "Đã hết hợp dụng" : null;
              const isVoucherCodeCopied = copied && copiedVoucherCode === voucher.voucherCode;
            return (
              <div
                className={`voucher-card ${overlayText ? 'overlay' : ''}`}
                key={voucher.id}
              >
                <div className="voucher-details">
                <h3>
                  <span
                    className={`voucher-code ${isVoucherCodeCopied ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(voucher.voucherCode)}
                  >
                    {voucher.voucherCode}
                  </span>
                  <FaClipboard 
                    className="copy-icon" 
                    onClick={() => copyToClipboard(voucher.voucherCode)} 
                  />
                </h3>
                  <p>{voucher.description}</p>
                  <p>Discount: {voucher.discountAmount} {voucher.discountType === 'Percentage' ? '%' : 'VND'}</p>
                  <p>Start Date: {new Date(voucher.startDate).toLocaleDateString('vi-VN')}</p>
                  <p>Expiry Date: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</p>
                  <p>Status: {voucher.status}</p>
                  <p>Usage: {voucher.used} / {voucher.usageLimit}</p>
                  {!overlayText &&  <button onClick={() => openPopup(voucher)} className="view-button">Xem chi tiết</button>}
                </div>
                <img src={`${url}/images/vouchers/${voucher.image}`} alt={voucher.voucherCode} className="voucher-image" />
                {overlayText && 
                <div className="voucher-overlay">
                  <h3> {overlayText}  </h3>
                  <a onClick={() => openPopup(voucher)}>
                      Click để chỉnh sửa</a>
                </div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
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
