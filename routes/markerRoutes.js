const express = require('express');
const router = express.Router();
const Marker = require('../models/Marker');

router.post('/', async (req, res) => {
  try {
    const marker = new Marker(req.body);
    await marker.save();
    res.status(201).json(marker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All
router.get('/', async (req, res) => {
    try {
      const markers = await Marker.find();
      res.json(markers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Read By ID
  router.get('/:id', async (req, res) => {
    try {
      const marker = await Marker.findById(req.params.id);
      if (marker == null) return res.status(404).json({ message: 'Cannot find marker' });
      res.json(marker);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // count Marker By ID
  router.get('/:id/markers', async (req, res) => {
    try {
      const userId = req.params.id;
      const count = await Marker.countDocuments({ userId: userId });
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update
  router.put('/:id', async (req, res) => {
    try {
      const marker = await Marker.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (marker == null) return res.status(404).json({ message: 'Cannot find marker' });
      res.json(marker);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete
  router.delete('/:id', async (req, res) => {
    try {
      const marker = await Marker.findByIdAndDelete(req.params.id);
      if (marker == null) return res.status(404).json({ message: 'Cannot find marker' });
      res.json({ message: 'Deleted the marker' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;
