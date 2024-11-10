/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddVoucher.css";
import { FaEdit, FaTimes, FaSave } from "react-icons/fa"; // Import icons
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddVoucherForm = ({ isOpen, closeModal, voucher, url }) => {
  const navigate = useNavigate();

  const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountType, setDiscountType] = useState("Percentage"); // State cho loại giảm giá
  const [expiryDate, setExpiryDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("Active");
  const [usageLimit, setUsageLimit] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [used, setUsed] = useState(0);

  // Fetch voucher details if editing
  useEffect(() => {
    if (voucher) {
      fetchVoucherDetails(voucher); // Pass voucher object to the function
      setIsEditing(false); // Đặt lại chế độ chỉnh sửa mỗi khi voucher được cập nhật
    } else {
      resetForm(); 
      setIsEditing(true);
    }
  }, [voucher]);

  const fetchVoucherDetails = (voucher) => {
    setVoucherCode(voucher.voucherCode);
    setDiscountAmount(voucher.discountAmount);
    setDiscountType(voucher.discountType);
    setExpiryDate(new Date(voucher.expiryDate).toISOString().split("T")[0]); // Convert to ISO format and extract date partvoucher.expiryDate);
    setStartDate(new Date(voucher.startDate).toISOString().split("T")[0]); // Convert to ISO format and extract date partvoucher.startDate);
    setStatus(voucher.status);
    setUsageLimit(voucher.usageLimit);
    setMinOrder(voucher.minOrder);
    setMaxDiscount(voucher.maxDiscount);
    setImage(voucher.image); // Set image as well
    setIsEditing(true); 
    setUsed(voucher.used); // Đặt chế độ chỉnh sửa nếu có voucher
  };

  console.log("Voucher:", voucher);
  const resetForm = () => {
    setVoucherCode("");
    setDiscountAmount("");
    setDiscountType("Percentage");
    setExpiryDate("");
    setStartDate("");
    setStatus("Active");
    setUsageLimit("");
    setUsed(0);
    setMinOrder("");
    setMaxDiscount("");
    setImage(null);
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!voucherCode || !discountAmount || !expiryDate || !startDate) {
      alert("Please fill in all required fields.");
      return;
    }
    if (expiryDate < startDate) {
      alert("Expiry date must be after start date.");
      return;
    }

    if(expiryDate < new Date().toISOString().split("T")[0] ){
      alert("Expiry date must be after current date.");
      return;
    }

    if(used > usageLimit){
      alert("Usage limit exceeded.");
      return;
    }

    const voucherData = {
      voucherCode,
      discountAmount,
      discountType,
      expiryDate,
      startDate,
      status,
      usageLimit,
      minOrder,
      maxDiscount,
      image,
      used
    };

    if (voucher) {
      updateVoucher(voucherData);
      console.log("Updating voucher:", voucherData);
    } else {
      // Add new voucher
      addVoucher(voucherData);
      console.log("Adding new voucher:", voucherData);
    }
    closeModal(); // Close the modal after submission
  };

  const updateVoucher = async (voucherData) => {
     try{
      voucherData={...voucherData,id:voucher._id}
      console.log(voucherData);
      const formData = new FormData();
      formData.append("image", image);
      formData.append("id", voucher._id);
      formData.append("voucherData", JSON.stringify(voucherData));

        const response = await axios.put(`${url}/api/voucher/${voucher._id}`,formData);
        
        if (response && response.data && response.data.success) {
          // Handle success response
          console.log("Voucher updated successfully:", response.data.message);
          toast.success(response.data.message);
        } else {
          // Handle error response if success is false
          const errorMessage = response?.data?.message || "An unexpected error occurred.";
          toast.error(errorMessage);
        }
     }
     catch(error){
        toast.error("Failed to update voucher");
        console.log(error);
     }
     
  };

  const addVoucher = async (voucherData) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("voucherData", JSON.stringify(voucherData));
      const response = await axios.post(`${url}/api/voucher/`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add voucher");
    }
   };

  const handleImageChange = (e) => {
    setImage( e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleEditClick = () => {
    setIsEditing(true); // Đặt chế độ chỉnh sửa
  };

  return (
    <>
    {isOpen && (
      <div className="voucher-modal-overlay">
        <div className="voucher-form-container">
          <h2>{voucher ? (isEditing ? "Edit Voucher" : "Voucher Details") : "Add New Voucher"}</h2>
          <button className="voucher-close-modal" onClick={closeModal}>
            <FaTimes />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="voucher-form-group">
              <h3>Voucher Code:</h3>
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                required
                placeholder="Enter voucher code"
                disabled={!isEditing}
              />
            </div>
              <div className="voucher-form-group">
                <h3>Discount Amount:</h3>
                <div className="discount-input">
                  <input
                    type="number" // Thay đổi loại input thành text
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)} // Giữ nguyên giá trị
                    required
                    placeholder="Enter amount"
                    disabled={!isEditing}
                  />
                  <select
                    value={discountType}
                    onChange={(e) => {setDiscountType(e.target.value), console.log(discountType)}}
                    disabled={!isEditing}
                  >
                    <option value="Percentage">%</option>
                    <option value="Fixed">vnd</option>
                  </select>
                </div>
              </div>

              <div className="voucher-form-group">
                <h3>Start Date:</h3>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="voucher-form-group">
                <h3>Expiry Date:</h3>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="voucher-form-group">
                <h3>Usage Limit:</h3>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="voucher-form-group">
                <h3>Used:</h3>
                <input
                  type="number"
                  value={used}
                  onChange={(e) => setUsed(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="voucher-form-group">
                <h3>Minimum Order:</h3>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="voucher-form-group">
                <h3>Maximum Discount:</h3>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="voucher-form-group">
                <h3>Status:</h3>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="voucher-form-group">
                <h3>Image:</h3>
                <input
                  type="file"
                  onChange={handleImageChange}
                  disabled={!isEditing}
                />
                {voucher ? (
                  <img src={previewImage ? previewImage :  `${url}/images/vouchers/${voucher.image}`} alt="Voucher" className="voucher-image" />
                ): (
                  <img src={previewImage && previewImage} alt="Voucher" className="voucher-image" />
                )}
              </div>

              <div className="voucher-form-buttons">
                {!voucher ? (
                  <div className="voucher-action-buttons">
                    <button type="submit" className="voucher-save-btn">
                      <FaSave /> Add Voucher
                    </button>
                    <button
                      type="button"
                      className="voucher-cancel-btn"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                ) : isEditing ? (
                  <div className="voucher-action-buttons">
                    <button type="submit" className="voucher-save-btn">
                      <FaSave /> Update Voucher
                    </button>
                    <button
                      type="button"
                      className="voucher-cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button" className="voucher-edit-btn" onClick={handleEditClick}>
                    <FaEdit /> Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddVoucherForm;
