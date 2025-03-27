const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Modify this path to save in the backend/qr directory
const generateQRCode = async (aadhar) => {
  try {
    const qrData = `http://localhost:5000/trace/${aadhar}`; // URL to trace page

    // Save the QR code in the backend/qr directory
    const qrCodePath = path.join(__dirname, '..', 'qr', `${aadhar}.png`);

    // Ensure the directory exists
    const dir = path.dirname(qrCodePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate the QR code and save it
    await QRCode.toFile(qrCodePath, qrData);
    console.log("Generated QRCode for Aadhar: " + aadhar);

    // Return the relative URL to the QR code image (which is served by Express)
    return `/qr/${aadhar}.png`; // This will be accessible via http://localhost:5000/qr/{aadhar}.png

  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

module.exports = generateQRCode;
