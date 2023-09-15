const express = require('express');
const router = express.Router();
const AdminMarker = require('../models/AdminMarker');

// Create
router.post('/', async (req, res) => {
  try {
    const adminMarker = new AdminMarker(req.body);
    await adminMarker.save();
    res.status(201).json(adminMarker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  try {
    const markers = await AdminMarker.find();
    res.json(markers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read By ID
router.get('/:id', async (req, res) => {
  try {
    const marker = await AdminMarker.findById(req.params.id);
    if (marker == null) return res.status(404).json({ message: 'Cannot find AdminMarker' });
    res.json(marker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const marker = await AdminMarker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (marker == null) return res.status(404).json({ message: 'Cannot find AdminMarker' });
    res.json(marker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const marker = await AdminMarker.findByIdAndDelete(req.params.id);
    if (marker == null) return res.status(404).json({ message: 'Cannot find AdminMarker' });
    res.json({ message: 'Deleted the AdminMarker' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
