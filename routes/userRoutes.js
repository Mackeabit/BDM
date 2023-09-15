const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create
router.post('/', (req, res) => {
    const newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(user);
    });
});


// Read All
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Read By ID
  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user == null) return res.status(404).json({ message: 'Cannot find User' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update
  router.put('/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (user == null) return res.status(404).json({ message: 'Cannot find User' });
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete
  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (user == null) return res.status(404).json({ message: 'Cannot find User' });
      res.json({ message: 'Deleted the User' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;
