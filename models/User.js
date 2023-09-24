const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            // googleId가 없을 때만 password 필드가 필수가 됩니다.
            return !this.googleId;
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // 이를 통해 null 값들 사이에서도 unique 제약을 유지합니다.
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

// 비밀번호 암호화
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// 비밀번호 검증 메서드
userSchema.methods.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
