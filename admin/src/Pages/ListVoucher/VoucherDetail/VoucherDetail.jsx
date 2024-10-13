import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './VoucherDetail.css';
const VoucherDetailPage = () => {
  const { id } = useParams();
  console.log(id);
  const [voucher, setVoucher] = useState(null);

  useEffect(() => {
    // Fetch voucher details from API using the voucher ID
    fetchVoucherDetails(id);
  }, [id]);

  const fetchVoucherDetails = () => {
    // Replace with API call to get voucher details by ID
    const dummyVoucher = {
      id: 1,
      voucherCode: 'SAVE20',
      discountAmount: '20%',
      expiryDate: '2024-12-31',
      status: 'Active',
      termsAndConditions: 'Only valid on orders over $50.',
    };
    setVoucher(dummyVoucher);
  };

  return (
    <div>
      {voucher ? (
        <div>
          <h2>Voucher Details: {voucher.voucherCode}</h2>
          <p><strong>Discount Amount:</strong> {voucher.discountAmount}</p>
          <p><strong>Expiry Date:</strong> {voucher.expiryDate}</p>
          <p><strong>Status:</strong> {voucher.status}</p>
          <p><strong>Terms & Conditions:</strong> {voucher.termsAndConditions}</p>
          
         
        </div>
      ) : (
        <p>Loading voucher details...</p>
      )}
    </div>
  );
};

export default VoucherDetailPage;
