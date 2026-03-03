const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinary');

// POST /api/upload  — accepts a single "image" field, returns { url }
router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'foodiehub',
    transformation: [{ width: 1200, crop: 'limit' }],
  });

  res.json({ url: result.secure_url });
});

module.exports = router;
