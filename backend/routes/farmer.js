const express = require('express');
const router = express.Router();
const Farmer = require('../models/farmerd'); // Ensure the model is correct

router.post('/', async (req, res) => {
  try {
    const farmerData = req.body; // Get the data from the frontend

    // Perform your logic to save the farmer data
    const newFarmer = new Farmer(farmerData);
    await newFarmer.save();

    res.status(201).json(newFarmer); // Return the farmer data in the response
  } catch (error) {
    console.error('Error creating farmer:', error);
    res.status(500).json({ error: 'Error creating farmer' });
  }
});

module.exports = router;
