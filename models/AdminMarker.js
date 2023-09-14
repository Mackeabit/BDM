const mongoose = require('mongoose');

const adminMarkerSchema = new mongoose.Schema({
    name: String,
    position: [Number], // [latitude, longitude]
    icon: String,
});

module.exports = mongoose.model('AdminMarker', adminMarkerSchema);
