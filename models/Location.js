const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: String,
    position: [Number], // [latitude, longitude]
    icon: String,
});

module.exports = mongoose.model('Location', locationSchema);
