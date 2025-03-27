const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const QRCode = require('qrcode');

require('dotenv').config();
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



const Farmer = require('./backend/models/farmerd');
const Pesticide = require('./backend/models/pesticide');
const Distributor = require('./backend/models/distributord');


const farmerRoutes = require('./backend/routes/farmer');
const pesticideSellerRoutes = require('./backend/routes/pesticideSeller');
const distributorRoutes = require('./backend/routes/distributor');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/qr', express.static(path.join(__dirname,'backend','qr')));
app.use('/api/distributor', distributorRoutes);;




app.get('/trace/:farmerAadhar', async (req, res) => {
  const { farmerAadhar } = req.params;
  try {
    const farmer = await Farmer.findOne({ aadharId: farmerAadhar });
    const pesticide = await Pesticide.findOne({ aadharNumber: farmerAadhar });
    const distributor = await Distributor.findOne({ farmerAadhar: farmerAadhar });

    if (!farmer || !pesticide || !distributor) {
      return res.status(404).send("Data not found.");
    }

    
    res.render('trace', {
      farmer: farmer,
      pesticide: pesticide,
      distributor: distributor,
    });
  } catch (error) {
    console.error('Error fetching trace data:', error);
    res.status(500).send("Server error while fetching data.");
  }
});



app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/farmer', farmerRoutes);
app.use('/api/pesticideSeller', pesticideSellerRoutes);
app.use('/api/distributor', distributorRoutes);
const db_path = process.env.MONGO_URI;
mongoose
  .connect(db_path, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const staticPath = path.join(__dirname, 'frontend');
app.use(express.static(staticPath));


app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.use('/qr', express.static(path.join(__dirname, 'frontend', 'qr'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

app.post('/api/generate-qr', async (req, res) => {
  try {
    const data = req.body;
    const farmerAadhar = data.farmerAadhar;
    const qrData = `http://localhost:5000/trace/${farmerAadhar}`;
    const qrCodePath = path.join(__dirname, 'frontend', 'qr', `${Date.now()}.png`);
    await QRCode.toFile(qrCodePath, qrData);
    res.json({ qrCodeUrl: `/qr/${Date.now()}.png` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code.' });
  }
});


app.post('/api/distributor', async (req, res) => {
  console.log('Incoming request body:', req.body); 
  
  const { productName, pickingDate, location, farmerAadhar, vendorName } = req.body;

  try {
    
    if (!productName || !pickingDate || !location || !farmerAadhar || !vendorName) {
      console.error('Missing required fields');
      return res.status(400).json({ message: 'All fields are required!' });
    }

    
    const existingDistributor = await Distributor.findOne({ farmerAadhar });
    if (existingDistributor) {
      console.error('Distributor with this Aadhar already exists');
      return res.status(400).json({ message: 'Distributor with this Aadhar already exists.' });
    }

    
    const newDistributor = new Distributor({
      productName,
      pickingDate,
      location,
      farmerAadhar,
      vendorName,
    });

    await newDistributor.save();

    
    res.status(201).json({ message: 'Distributor data saved successfully!' });
  } catch (error) {
    console.error('Error saving distributor:', error); // Log the error stack
    res.status(500).json({ message: 'Internal server error' });
  }
});
  
// Trace route
app.get('/trace/:farmerAadhar', async (req, res) => {
  const { farmerAadhar } = req.params;
  try {
    const farmer = await Farmer.findOne({ aadharId: farmerAadhar });
    const pesticide = await Pesticide.findOne({ aadharNumber: farmerAadhar });
    const distributor = await Distributor.findOne({ farmerAadhar: farmerAadhar });

    if (!farmer || !pesticide || !distributor) {
      return res.status(404).send("Data not found.");
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Product Traceability</title>
        <link rel="stylesheet" href="styleT.css">
      </head>
      <body>
        <div class="container">
          <h1>Product Origin Details</h1>
          <div class="section">
            <h2>Farmer Details</h2>
            <p><strong>Name:</strong> ${farmer.name}</p>
            <p><strong>Location:</strong> ${farmer.location}</p>
            <p><strong>Farm Size:</strong> ${farmer.farmSize} acres</p>
            <p><strong>Certification:</strong> ${farmer.npopCertification ? 'NPOP Certified' : 'Standard'}</p>
          </div>
          <div class="section">
            <h2>Products</h2>
            ${farmer.products.length > 0 ? `
              <ul>
                ${farmer.products.map(product => `
                  <li>
                    <strong>Product Name:</strong> ${product.productName}<br>
                    <strong>Quantity:</strong> ${product.productQuantity} units<br>
                    <strong>Growth Period:</strong> ${product.daysToGrow} days
                  </li>
                `).join('')}` : '<p>No products found.</p>'}
          </div>
          <div class="section">
            <h2>Pesticides Used</h2>
            ${pesticide.pesticides.length > 0 ? `
              <ul>
                ${pesticide.pesticides.map(p => `
                  <li>
                    <strong>Name:</strong> ${p.pesticideName}<br>
                    <strong>Type:</strong> ${p.pesticideType}<br>
                    <strong>Quantity:</strong> ${p.quantity} units
                  </li>
                `).join('')}` : '<p>No pesticide data available.</p>'}
          </div>
          <div class="section">
            <h2>Distributor Details</h2>
            <p><strong>Distributor Name:</strong> ${distributor.vendorName}</p>
            <p><strong>Location:</strong> ${distributor.location}</p>
            <p><strong>Product Name:</strong> ${distributor.productName}</p>
            <p><strong>Picking Date:</strong> ${new Date(distributor.pickingDate).toLocaleDateString()}</p>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching trace data:', error);
    res.status(500).send("Server error while fetching data.");
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
