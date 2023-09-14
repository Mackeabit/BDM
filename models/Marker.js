const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
    name: String,
    position: [Number], // [latitude, longitude]
    icon: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Marker', markerSchema);
