const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: { // 암호화된 패스워드를 저장
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'user', 'guest'],
        default: 'user'
    },
    markers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marker'
    }]
});

module.exports = mongoose.model('User', userSchema);
