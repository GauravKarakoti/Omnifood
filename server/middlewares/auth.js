const jwt = require('jsonwebtoken');
const { asyncError } = require('./error.js');
const ErrorHandler = require('../utils/error.js');
const User = require('../models/user.js');
require("dotenv").config

const isAuthenticated = asyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        throw new ErrorHandler("Unauthorized", 401);
    }
    const jwtSecretKey = process.env.JWT_SECRET;
    if (!jwtSecretKey) {
        throw new ErrorHandler("JWT_SECRET is not defined in environment variables", 500);
    }

    const decodedData = jwt.verify(token,jwtSecretKey );


    if (decodedData.exp * 1000< Date.now()) {
        throw new ErrorHandler("Token expired. Please log in again.", 401);
    }
    req.user = await User.findById(decodedData.id);

    next();
})

module.exports = {
    isAuthenticated
}
