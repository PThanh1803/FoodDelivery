import React, { useEffect, useState , useContext} from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './PromotionDetail.css';
import CryptoJS from 'crypto-js'; // Make sure to import your decryption function

const PromotionDetail = () => {
    const { url } = useContext(StoreContext);
    const [offerDetails, setOfferDetails] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const decryptedID = CryptoJS.AES.decrypt(id, 'secret-key').toString(CryptoJS.enc.Utf8); 

    useEffect(() => {
        const fetchPromotionDetails = async () => {
            try {
                console.log("Encrypted ID: ", id);
                console.log("Decrypted ID: ", decryptedID);

                // Fetch promotion details by ID
                const response = await axios.post(`${url}/api/promotion/promo/getbyid`, {id: decryptedID}); 
                console.log(response.data);
                if (response.data.success) {
                    setOfferDetails(response.data.promotion);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching promotion details:", error);
                setError("Error fetching promotion details");
            }
        };

        fetchPromotionDetails();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!offerDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div className='special-offers-details-container'>
            <h1 className='special-offers-title'>{offerDetails.title}</h1>
            <p className='special-offers-time'>
               Start at: {new Date(offerDetails.startDate).toLocaleDateString('vi-VN')} - End at: {new Date(offerDetails.expiryDate).toLocaleDateString('vi-VN')}
            </p>
            <p className='special-offers-description'>Description: {offerDetails.description}</p>
            <img className='special-offers-image' src={`${url}/images/promotions/${offerDetails.image}`} alt={offerDetails.title} />
            <div>
                
                <div 
                    className='special-offers-content' 
                    dangerouslySetInnerHTML={{ __html: offerDetails.content }} 
                />
            </div>
        </div>
    );
};

export default PromotionDetail;
