import React from 'react';
import { useLocation } from 'react-router-dom';
import './SpecialOffersDetails.css';

const SpecialOffersDetails = () => {
    const location = useLocation();
    const { offerDetails } = location.state || {};

    if (!offerDetails) {
        return <p>Offer not found!</p>;
    }

    return (
        <div className='special-offers-details-container'>
            <h1 className='special-offers-title'>{offerDetails.title}</h1>
            <p className='special-offers-time'>{offerDetails.timeStart} - {offerDetails.timeEnd}</p>
            <img className='special-offers-image' src={offerDetails.image} alt={offerDetails.title} />
            <div>
                <p className='special-offers-description'>Description: {offerDetails.description}
                    Description: {offerDetails.description}
                    Description: {offerDetails.description}
                    Description: {offerDetails.description}
                    Description: {offerDetails.description}
                    Description: {offerDetails.description}</p>
                <p className='special-offers-code'>Voucher Code: {offerDetails.voucherCode}</p>
            </div>
        </div>
    );
};

export default SpecialOffersDetails;
