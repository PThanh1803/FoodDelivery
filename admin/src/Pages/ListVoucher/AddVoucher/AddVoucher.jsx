/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddVoucher.css";
import { FaEdit, FaTimes, FaSave } from "react-icons/fa"; // Import icons

const AddVoucherForm = ({ isOpen, closeModal, voucher }) => {
  const navigate = useNavigate();

  const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("Active");
  const [usageLimit, setUsageLimit] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái để kiểm soát chế độ chỉnh sửa

  // Fetch voucher details if editing
  useEffect(() => {
    if (voucher) {
      fetchVoucherDetails(voucher); // Pass voucher object to the function
      setIsEditing(false); // Đặt lại chế độ chỉnh sửa mỗi khi voucher được cập nhật
    } else {
      resetForm(); // Reset the form if no voucher is passed (for adding new voucher)
    }
  }, [voucher]);

  const fetchVoucherDetails = (voucher) => {
    setVoucherCode(voucher.voucherCode);
    setDiscountAmount(voucher.discountAmount);
    setExpiryDate(voucher.expiryDate);
    setStartDate(voucher.startDate);
    setStatus(voucher.status);
    setUsageLimit(voucher.usageLimit);
    setMinOrder(voucher.minOrder);
    setMaxDiscount(voucher.maxDiscount);
    setImage(voucher.image); // Set image as well
    setIsEditing(true); // Đặt chế độ chỉnh sửa nếu có voucher
  };

  const resetForm = () => {
    setVoucherCode("");
    setDiscountAmount("");
    setExpiryDate("");
    setStartDate("");
    setStatus("Active");
    setUsageLimit("");
    setMinOrder("");
    setMaxDiscount("");
    setImage(null);
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const voucherData = {
      voucherCode,
      discountAmount,
      expiryDate,
      startDate,
      status,
      usageLimit,
      minOrder,
      maxDiscount,
      image,
    };

    if (isEditing) {
      updateVoucher(voucherData);
      console.log("Updating voucher:", voucherData);
    } else {
      // Add new voucher
      addVoucher(voucherData);
      console.log("Adding new voucher:", voucherData);
    }

    navigate("/voucher");
    closeModal(); // Close the modal after submission
  };

  const updateVoucher = (voucherData) => {
    // Replace with API call to update voucher
  };

  const addVoucher = (voucherData) => {
    // Replace with API call to add new voucher
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleEditClick = () => {
    setIsEditing(true); // Đặt chế độ chỉnh sửa
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="add-voucher-form">
            <h2>{voucher ?( isEditing ? "Edit Voucher": "Voucher Details" ) : "Add New Voucher"}</h2>
            <button className="close-modal" onClick={closeModal}>
              <FaTimes />
            </button>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <h3>Voucher Code:</h3>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  required
                  placeholder="Enter voucher code"
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="form-group">
                <h3>Discount Amount:</h3>
                <input
                  type="text"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  required
                  placeholder="Enter discount amount"
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="form-group">
                <h3>Start Date:</h3>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="form-group">
                <h3>Expiry Date:</h3>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="form-group">
                <h3>Usage Limit:</h3>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="form-group">
                <h3>Minimum Order:</h3>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="form-group">
                <h3>Maximum Discount:</h3>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  required
                  disabled={!isEditing} // Disable input if not in edit mode
                />
              </div>

              <div className="form-group">
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

              <div className="form-group">
                <h3>Image:</h3>
                <input
                  type="file"
                  onChange={handleImageChange}
                  disabled={!isEditing}
                />
                {image && (
                  <img src={image} alt="Voucher" className="voucher-image" />
                )}
              </div>

              <div className="form-buttons">
                {!voucher ? (
                  <div className="form-button">
                    <button type="submit">
                      <FaSave /> Add Voucher
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                ) : isEditing ? (
                  <div className="form-button">
                    <button type="submit">
                      <FaSave /> Update Voucher
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={handleEditClick}>
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
