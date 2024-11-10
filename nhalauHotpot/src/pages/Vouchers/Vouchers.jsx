import React, { useEffect, useContext, useState } from 'react';
import './Vouchers.css';
import { StoreContext } from '../../context/StoreContext';
import copy_icon from '../../assets/copy-regular-24.png';
const Vouchers = () => {
    const { url } = useContext(StoreContext);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVouchers = async () => {
        setLoading(true);
        setError(null);

        try {
            // Tạo URL và thêm tham số `status` và `date`
            const apiUrl = new URL(`${url}/api/voucher/`);
            apiUrl.searchParams.append(status, "Active");

            // Lấy ngày hiện tại và chuyển sang định dạng MM/DD/YYYY
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
            const day = String(today.getDate()).padStart(2, '0');
            const year = today.getFullYear();
            const currentDate = `${month}/${day}/${year}`;

            apiUrl.searchParams.append("date", currentDate);

            // Gửi yêu cầu fetch với URL chứa tham số query
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.success) {
                throw new Error('Failed to fetch vouchers');
            }

            setVouchers(data.vouchers);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            setError('Error fetching vouchers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchVouchers();
    }, [url]);
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
                    <ul className="vouchers-list">
                        {vouchers.map((voucher) => (
                            <li key={voucher._id} className="voucher-item">
                                <div className="voucher-details">
                                    <h3 onClick={() => handleCopyToClipboard(voucher.voucherCode)} className='voucher-code'>Code: {voucher.voucherCode}</h3>
                                    <p className={`${voucher.discountType === 'Percentage' ? 'percentage' : 'fixed'}`}>{voucher.discountAmount} {voucher.discountType === 'Percentage' ? '%' : 'VND'}</p>
                                    <div className='voucher-info'>
                                        <p className='voucher-description'>Description: {voucher.description}</p>
                                        <p>Min Order: {voucher.minOrder.toLocaleString()} VND</p>
                                        <p>Max Discount: {voucher.maxDiscount.toLocaleString()} VND</p>
                                        <p>Expiry Date: {new Date(voucher.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                    <p className='voucher-only'>{voucher.usageLimit} vouchers left</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No vouchers available</p>
                )}
            </div>
        </div>
    );
};

export default Vouchers;
