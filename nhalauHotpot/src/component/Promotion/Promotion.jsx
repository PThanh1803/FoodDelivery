import React, { useState, useEffect, useContext } from 'react';
import './Promotion.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';

const Promotions = () => {
    const { url } = useContext(StoreContext);
    const [promotions, setPromotions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch Promotions with Pagination
    const fetchPromotions = async (page = 1) => {
        try {
            const response = await axios.get(`${url}/api/promotion/list?page=${page}&limit=5`);
            if (response.data.success) {
                setPromotions(response.data.promotions);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch promotions');
            console.error('Error fetching promotions:', error);
        }
    };

    useEffect(() => {
        fetchPromotions(currentPage);
    }, [url, currentPage]);

    // Pagination handlers
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePromoClick = (promoId) => {
        const encryptedID = encodeURIComponent(CryptoJS.AES.encrypt(promoId, 'secret-key').toString());
        window.location.href = `/promotions/${encryptedID}`;
    };
    
    return (
        <div className="promotions-container">
            <h1>Promotions</h1>
            {promotions.length === 0 ? (
                <p>No promotions available</p>
            ) : (
                <ul className="promotion-list">
                    {promotions.map((promo) => (
    <li key={promo.id} className="promotion-item" onClick={() => handlePromoClick(promo._id)}>
        <img src={`${url}/images/promotions/${promo.image}`} alt={promo.title} className="promotion-image" />
        <div className="promotion-details">
            <h3 className="promotion-title">{promo.title}</h3>
            <p className="promotion-date">{new Date(promo.dateCreated).toLocaleDateString()}</p>
            <p className="promotion-description">{promo.description}</p>
        </div>
    </li>
))}

                </ul>
            )}

            <div className="pagination-controls">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default Promotions;