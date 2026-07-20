// backend/src/models/Client.js
import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  clientId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
  country: { type: String, default: '' },
  company: { type: String, default: '' },
  type: { 
    type: String, 
    enum: ['Individual', 'Company', 'Law Firm', 'Government', 'Other'],
    default: 'Individual' 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'archived'],
    default: 'active' 
  },
  notes: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  collection: 'clients',
  timestamps: true 
});

clientSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  }
});

const Client = mongoose.model('Client', clientSchema);
export default Client;