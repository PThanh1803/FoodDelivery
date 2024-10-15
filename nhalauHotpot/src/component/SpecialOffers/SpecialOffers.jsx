import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SpecialOffers.css';
import copy_icon from '../../assets/copy-regular-24.png';
import check_icon from '../../assets/check-regular-24.png'; // Icon kiểm tra khi đã sao chép

const SpecialOffers = () => {
    const [copiedIndex, setCopiedIndex] = React.useState(null);
    const navigate = useNavigate();

    const specialOffers = [
        {
            id: 1,
            image: 'https://via.placeholder.com/300x200',
            title: 'Buy One Get One Free',
            timeStart: '2024-10-13 10:00 AM',
            timeEnd: '2024-10-14 11:59 PM',
            description: 'Enjoy a special offer: Buy one and get another for free on selected items!',
            voucherCode: 'BOGO2024'
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/300x200',
            title: '20% Off Your Next Purchase',
            timeStart: '2024-10-15 12:00 PM',
            timeEnd: '2024-10-16 11:59 PM',
            description: 'Get 20% off your next purchase when you use this voucher code.',
            voucherCode: 'DISCOUNT20'
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/300x200',
            title: 'Free Delivery',
            timeStart: '2024-10-17 9:00 AM',
            timeEnd: '2024-10-17 10:00 PM',
            description: 'Enjoy free delivery on all orders placed within the promotion period.',
            voucherCode: 'FREEDEL2024'
        }
    ];

    // Hàm điều hướng tới chi tiết ưu đãi
    const handleNavigate = (item) => {
        navigate(`/specialoffers/${item.id}`, { state: { offerDetails: item } });
    };

    const handleCopy = (index, voucherCode) => {
        navigator.clipboard.writeText(voucherCode)
            .then(() => {
                setCopiedIndex(index);
                setTimeout(() => {
                    setCopiedIndex(null);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div className='special-offers-container'>
            <h1>Special Offers</h1>
            {specialOffers.map((item, index) => (
                <div key={index} className='special-offers-list'>
                    <img
                        src={item.image}
                        alt={item.title}
                        onClick={() => handleNavigate(item)} // Điều hướng khi click vào hình ảnh
                        style={{ cursor: 'pointer' }} // Đổi thành con trỏ chuột chỉ tay
                    />
                    <div className='special-offers-info'>
                        <h3 onClick={() => handleNavigate(item)} style={{ cursor: 'pointer' }}>
                            {item.title}
                        </h3>
                        <p>{item.timeStart} - {item.timeEnd}</p>
                        <p>{item.description}</p>
                        <div className='special-offers-code'>
                            <p>Code: {item.voucherCode}</p>
                            <img
                                src={copiedIndex === index ? check_icon : copy_icon}
                                alt={copiedIndex === index ? "copied" : "copy now"}
                                onClick={() => handleCopy(index, item.voucherCode)}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SpecialOffers;
