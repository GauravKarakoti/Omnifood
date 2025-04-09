const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const { sendToken, cookieOptions } = require("../utils/features.js");
const { asyncError } = require("../middlewares/error.js");
const ErrorHandler = require("../utils/error.js");
const { sendVerificationEmail } = require("../utils/sendMail.js");

const signup = asyncError(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }

    const isUserExist = await User.findOne({ email, username });
    if (isUserExist) {
        return next(new ErrorHandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = bcrypt.hashSync(email, 10).replace(/\//g, "");
    const verifyExpire = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        verifyToken,
        verifyExpire,
    })

    const verificationLink = `${process.env.SERVER_URL}/api/auth/verify-email/${verifyToken}`;

    await sendVerificationEmail(user, verificationLink);

    sendToken(user, res, `Welcome ${user.username},Please check your email for verification.`, 201);
})

const login = asyncError(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    sendToken(user, res, `Welcome back ${user.username}`, 200);
})

const verifyEmail = asyncError(async (req, res, next) => {
    const { verifyToken } = req.params;

    const user = await User.findOne({ verifyToken });

    if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/email-verification?status=error&message=Invalid token`);
    }

    if (user.verifyExpire < Date.now()) {
        return res.redirect(`${process.env.CLIENT_URL}/email-verification?status=error&message=Token expired`);
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyExpire = null;

    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/email-verification?status=success&message=Email verified successfully`);
})

const getProfile = asyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    return res.status(200).json({
        success: true,
        user
    })
})

const logout = asyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        ...cookieOptions
    })

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

module.exports = {
    signup,
    login,
    getProfile,
    verifyEmail,
    logout
}