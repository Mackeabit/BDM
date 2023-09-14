const mongoose = require('mongoose');

const npcSchema = new mongoose.Schema({
    name: String,
    position: [Number], // [latitude, longitude]
    icon: String,
});

module.exports = mongoose.model('NPC', npcSchema);
