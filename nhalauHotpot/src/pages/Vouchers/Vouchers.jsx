import React, { useEffect, useContext, useState } from 'react';
import './Vouchers.css';
import { StoreContext } from '../../Context/StoreContext';
import copy_icon from '../../assets/copy-regular-24.png';

const Vouchers = () => {
    const { url } = useContext(StoreContext);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(4); // Set items per page

    const fetchVouchers = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const apiUrl = new URL(`${url}/api/voucher/`);
            apiUrl.searchParams.append("page", page);
            apiUrl.searchParams.append("limit", limit);
            apiUrl.searchParams.append("status", "Active");

            const today = new Date();
            const currentDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
            apiUrl.searchParams.append("date", currentDate);

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.success) {
                throw new Error('Failed to fetch vouchers');
            }

            setVouchers(data.vouchers);
            setCurrentPage(data.pagination.currentPage);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            setError('Error fetching vouchers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers(currentPage);
    }, [url, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleCopyToClipboard = (voucherCode) => {
        navigator.clipboard.writeText(voucherCode)
            .then(() => {
                alert("Voucher code copied to clipboard!");
            })
            .catch((error) => {
                console.error("Error copying to clipboard:", error);
            });
    };

    return (
        <div className="vouchers-container">
            <h1>Available Vouchers</h1>
            <div className="vouchers-list-container">
                {loading ? (
                    <p>Loading vouchers...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : vouchers.length > 0 ? (
                    <>
                        <ul className="vouchers-list">
                            {vouchers.map((voucher) => (
                                <li key={voucher._id} className="voucher-item">
                                    <div className="voucher-details">
                                        <h3 onClick={() => handleCopyToClipboard(voucher.voucherCode)} className="voucher-code">
                                            Code: {voucher.voucherCode}
                                        </h3>
                                        <p className={`${voucher.discountType === 'Percentage' ? 'percentage' : 'fixed'}`}>
                                            {voucher.discountAmount} {voucher.discountType === 'Percentage' ? '%' : 'VND'}
                                        </p>
                                        <div className="voucher-info">
                                            <p className="voucher-description">Description: {voucher.description}</p>
                                            <p>Min Order: {voucher.minOrder.toLocaleString()} VND</p>
                                            <p>Max Discount: {voucher.maxDiscount.toLocaleString()} VND</p>
                                            <p>Expiry Date: {new Date(voucher.expiryDate).toLocaleDateString()}</p>
                                        </div>
                                        <p className="voucher-only">{voucher.usageLimit} vouchers left</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="pagination-controls">
                            <button
                                className="page-button"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </button>
                            <span className="current-page">{`Page ${currentPage} of ${totalPages}`}</span>
                            <button
                                className="page-button"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <p>No vouchers available</p>
                )}
            </div>
        </div>
    );
};

export default Vouchers;
