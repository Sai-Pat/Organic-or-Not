// models/pesticide.js
const mongoose = require('mongoose');


const pesticideSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  aadharNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{12}$/.test(v); // Validates 12-digit Aadhar number
      },
      message: props => `${props.value} is not a valid Aadhar number!`
    }
  },
  crops: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  pesticides: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    }
  ]
});

// Remove the 'farmerFillData' field
const Pesticide = mongoose.model('Pesticide', pesticideSchema);

module.exports = Pesticide;
