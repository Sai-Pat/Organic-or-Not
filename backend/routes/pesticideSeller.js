// backend/routes/pesticideSeller.js
const express = require('express');
const router = express.Router();
const Pesticide = require('../models/pesticide');  // Import the Pesticide model

// POST route to save pesticide seller information
router.post('/', async (req, res) => {
  try {
    // Destructuring the data sent from the frontend
    const { farmerName, aadharNumber, data } = req.body;
    const { crops, pesticides } = data;

    // Check if 'crops' and 'pesticides' are provided in the data
    if (!Array.isArray(crops) || !Array.isArray(pesticides)) {
      return res.status(400).json({ error: 'Both crops and pesticides must be arrays' });
    }

    // Check if farmer with the given Aadhar number already exists
    let farmerRecord = await Pesticide.findOne({ aadharNumber });

    // If farmer doesn't exist, create a new one
    if (!farmerRecord) {
      farmerRecord = new Pesticide({
        farmerName,
        aadharNumber,
        crops: [],  // Initialize empty crop array
        pesticides: [],  // Initialize empty pesticide array
      });
    }

    // Add the new crops and pesticides to the existing arrays
    farmerRecord.crops.push(...crops);
    farmerRecord.pesticides.push(...pesticides);

    // Save the updated farmer record to the database
    await farmerRecord.save();

    res.status(200).json({
      message: 'Pesticide seller data saved successfully!',
      pesticideSeller: farmerRecord,
    });
  } catch (error) {
    console.error('Error in pesticide sale route:', error);
    res.status(500).json({ error: 'Error processing pesticide sale' });
  }
});

// GET route to fetch pesticide data by Aadhar number
router.get('/:aadharNumber', async (req, res) => {
  try {
    const { aadharNumber } = req.params;
    console.log(`Fetching pesticide data for Aadhar: ${aadharNumber}`);
    
    const pesticideSales = await Pesticide.findOne({ aadharNumber });
    console.log('Pesticide Sales:', pesticideSales);

    if (!pesticideSales) {
      return res.status(404).json({ message: 'No pesticide data found for this Aadhar number' });
    }

    res.status(200).json(pesticideSales);
  } catch (error) {
    console.error('Error fetching pesticide data:', error);
    res.status(500).json({ error: 'Error fetching pesticide data' });
  }
});

module.exports = router;
