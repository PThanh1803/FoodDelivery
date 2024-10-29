import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.parse(Date.now())
  },
  startDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },

  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});
const promotionModel =  mongoose.models.Promotion || mongoose.model('Promotion', promotionSchema);

export default promotionModel