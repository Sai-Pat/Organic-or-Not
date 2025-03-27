const express = require('express');
const router = express.Router();
const Distributor = require('../models/distributord');
const generateQRCode = require('../utils/generateQRCode'); // Import QR code generation function

// POST route to save distributor data and generate QR code
router.post('/', async (req, res) => {
  console.log(req.body); // Log the incoming request body
  
  const { productName, pickingDate, location, farmerAadhar, vendorName } = req.body;

  try {
    // Validate the input
    if (!productName || !pickingDate || !location || !farmerAadhar || !vendorName) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check if the distributor already exists based on the Aadhar number
    const existingDistributor = await Distributor.findOne({ farmerAadhar });
    if (existingDistributor) {
      return res.status(400).json({ message: 'Distributor with this Aadhar already exists.' });
    }

    // Create a new distributor
    const newDistributor = new Distributor({
      productName,
      pickingDate,
      location,
      farmerAadhar,
      vendorName,
    });

    // Save the new distributor to the database
    await newDistributor.save();

    // Generate QR code for the distributor's Aadhar number
    const qrCodeUrl = await generateQRCode(farmerAadhar); // Generate and get the URL

    // Send success response along with the QR code URL
    res.status(201).json({
      message: 'Distributor data saved successfully!',
      qrCodeUrl, // Return the URL to the generated QR code
    });

  } catch (error) {
    console.error('Error saving distributor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
