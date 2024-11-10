import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './PromotionForm.css';
import DOMPurify from 'dompurify';
import {FaTimes} from 'react-icons/fa';

const PromotionForm = ({ isVisible, onClose, onSubmit, initialData = {}, modalType ,url}) => {
  
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('active');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setContent(initialData?.content || '');
    setImage(initialData?.image || '');
    setStatus(initialData?.status || 'active');
    setStartDate(new Date().toISOString().split("T")[0] || '');
    setExpiryDate(new Date().toISOString().split("T")[0] ||  '');
    setDateCreated( Date.now());
    
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setImagePreview(null);
    onSubmit({ title, description, content, image, status, startDate, expiryDate, dateCreated });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setImage(file);
  };

  if (!isVisible) return null;

  return (
    <div className="promotion-modal-overlay">
      <div className="promotion-modal-content">
      <button className="voucher-close-modal" onClick={onClose}>
            <FaTimes />
          </button>
        <form className="promotion-form" onSubmit={handleSubmit}>
          {modalType === 'add' && <h2 className="promotion-h2">Thêm Khuyến Mãi Mới</h2>}
          {modalType === 'edit' && <h2 className="promotion-h2">Chỉnh Sửa Khuyến Mãi</h2>}
          {modalType === 'details' && <h2 className="promotion-h2">Chi Tiết Khuyến Mãi</h2>}

          {modalType !== 'details' && (
            <>
              <div className="promotion-form-group">
                <label className="promotion-label">Tiêu đề</label>
                <input
                  type="text"
                  className="promotion-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="promotion-form-group">
                <label className="promotion-label">Trang thái</label>
                <select
                  className="promotion-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Khóa</option>
                </select>
              </div>

              <div className="promotion-form-group">
                <label className="promotion-label">Ngày bắt đầu</label>
                <input
                  type="date"
                  
                  className="promotion-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="promotion-form-group">
                <label className="promotion-label">Ngày kết thúc</label>
                <input
                  type="date"
                  className="promotion-input"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>

              <div className="promotion-form-group">
                <label className="promotion-label">Hình ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  className="promotion-input"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="promotion-image-preview" />
                ) : (
                    image && <img src={`${url}/images/promotions/${image}`} alt="Promotion" className="promotion-image" />
                )}

    
              </div>
              <div className="promotion-form-group">
                <label className="promotion-label">Mô tả</label>
                <input
                  type="text"
                  className="promotion-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="promotion-form-group">
                <label className="promotion-label">Nội dung khuyến mãi</label>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={{
                    toolbar: [
                      [{ 'font': [] }, { 'size': [] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ],
                  }}
                  formats={[
                    'font', 'size', 'bold', 'italic', 'underline', 'strike',
                    'color', 'background', 'align', 'list', 'bullet'
                  ]}
                  theme="snow"
                  className="promotion-input-quill"
                />
              </div>

              <div className="promotion-button-group">
                <button type="submit" className="promotion-submit-btn">Lưu</button>
                <button type="button" className="promotion-cancel-btn" onClick={onClose}>Cancel</button>
              </div>
              
            </>
          )}
          {modalType === 'details' && (
            <div>
              <p><strong>Tiêu đề:</strong> {title}</p>
              <p><strong>Ngày đăng </strong> {dateCreated}</p>
              <p><strong>Mô tả:</strong> {description}</p>
              <p><strong>Chương trình bắt đầu từ</strong> {startDate}</p><p><strong>Chương trình kết thúc:</strong> {expiryDate}</p>
              <img src={`${url}/images/promotions/${image}`} alt="Promotion" className="promotion-image" />
              <p><strong>Nội dung khuyến mãi:</strong></p>
              <div
                className="promotion-content"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PromotionForm;
