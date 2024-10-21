import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './PromotionForm.css';

const PromotionForm = ({ isVisible, onClose, onSubmit, initialData = {}, modalType }) => {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setContent(initialData?.content || '');
    setImage(initialData?.image || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, content, image });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  if (!isVisible) return null;

  return (
    <div className="promotion-modal-overlay">
      <div className="promotion-modal-content">
        <button className="promotion-close-btn" onClick={onClose}>
          &times;
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
                <label className="promotion-label">Hình ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  className="promotion-input"
                  onChange={handleImageChange}
                />
                {image && <img src={image} alt="Promotion" className="promotion-image" />}
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
              <p><strong>Mô tả:</strong> {description}</p>
              <img src={image} alt="Promotion" className="promotion-image" />
              <p><strong>Nội dung khuyến mãi:</strong></p>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PromotionForm;
