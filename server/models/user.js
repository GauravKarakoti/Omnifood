const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require("dotenv").config;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyToken: {
        type: String
    },
    verifyExpire: {
        type: Date
    },
    // googleId:{
    //     type: String,
    //     allowNull: true,
    // }
}, {
    timestamps: true
})

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

module.exports = mongoose.model('User', userSchema);