const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for the distributor
const distributorSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    farmerAadhar: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return /\d{12}/.test(v); // Validate that Aadhar is a 12-digit number
        },
        message: props => `${props.value} is not a valid Aadhar number!`,
      },
    },
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    distributor: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    pickingDate: {
      type: Date, // Use Date type instead of String
      required: true,
    },
    qrCodePath: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Add an index for faster querying by `farmerAadhar`


// Create a model for the distributor
const distributors = mongoose.model('distributors', distributorSchema);

module.exports = distributors;
