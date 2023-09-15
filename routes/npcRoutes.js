const express = require('express');
const router = express.Router();
const NPC = require('../models/NPC');

router.post('/', async (req, res) => {
  try {
    const npc = new NPC(req.body);
    await npc.save();
    res.status(201).json(npc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All
router.get('/', async (req, res) => {
    try {
      const npcs = await NPC.find();
      res.json(npcs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Read By ID
  router.get('/:id', async (req, res) => {
    try {
      const npc = await NPC.findById(req.params.id);
      if (npc == null) return res.status(404).json({ message: 'Cannot find NPC' });
      res.json(npc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update
  router.put('/:id', async (req, res) => {
    try {
      const npc = await NPC.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (npc == null) return res.status(404).json({ message: 'Cannot find NPC' });
      res.json(npc);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete
  router.delete('/:id', async (req, res) => {
    try {
      const npc = await NPC.findByIdAndDelete(req.params.id);
      if (npc == null) return res.status(404).json({ message: 'Cannot find NPC' });
      res.json({ message: 'Deleted the NPC' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;
