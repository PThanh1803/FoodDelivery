import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  voucherCode: {
    type: String,
    required: true,
    unique: true
  },
  discountAmount: {
    type: Number, // Có thể dùng số thay vì chuỗi nếu cần tính toán
    required: true
  },
  discountType: {
    type: String,
    enum: ['Percentage', 'Fixed'],
    default: 'Percentage'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Expired'],
    default: 'Active'
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 1,
    required: true
  },
  used: {
    type: Number,
    default: 0,
    required: true
  },
  minOrder: {
    type: Number,
    required: true
  },
  maxDiscount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const voucherModel = mongoose.models.voucher || mongoose.model("voucher", voucherSchema);

export default voucherModel;
