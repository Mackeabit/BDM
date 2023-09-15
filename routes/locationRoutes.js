const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

router.post('/', async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Read All
router.get('/', async (req, res) => {
    try {
      const locations = await Location.find();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Read By ID
  router.get('/:id', async (req, res) => {
    try {
      const location = await Location.findById(req.params.id);
      if (location == null) return res.status(404).json({ message: 'Cannot find location' });
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update
  router.put('/:id', async (req, res) => {
    try {
      const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (location == null) return res.status(404).json({ message: 'Cannot find location' });
      res.json(location);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete
  router.delete('/:id', async (req, res) => {
    try {
      const location = await Location.findByIdAndDelete(req.params.id);
      if (location == null) return res.status(404).json({ message: 'Cannot find location' });
      res.json({ message: 'Deleted the location' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;
