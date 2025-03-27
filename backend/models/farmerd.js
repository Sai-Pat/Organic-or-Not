const mongoose = require('mongoose');


const Schema = mongoose.Schema;

// Product Schema
const productSchema = new Schema({
  productName: { type: String, required: true },
  productQuantity: { type: Number, required: true, min: 1 },
  plantingDate: { type: Date, required: true },
  harvestingDate: { type: Date, required: true },
  daysToGrow: {
    type: Number,
    required: true,
    min: 1,
  }
});

// Calculate `daysToGrow` on save using pre-save hook
productSchema.pre('save', function (next) {
  if (this.plantingDate && this.harvestingDate) {
    const diffTime = Math.abs(new Date(this.harvestingDate) - new Date(this.plantingDate));
    this.daysToGrow = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
  }
  next();
});

// Farmer Schema
const farmerSchema = new Schema({
  name: { type: String, required: true },
  aadharId: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  farmSize: { type: Number, required: true, min: 1 },
  products: { type: [productSchema], required: true },
  npopCertification: { type: Boolean, default: false },
});

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;
