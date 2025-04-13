const express = require('express');
const {
    signup,
    login,
    getProfile,
    verifyEmail,
    logout
} = require('../controllers/user')
const { isAuthenticated } = require('../middlewares/auth.js');
const passport = require('../middlewares/passport.js');
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.get('/user', isAuthenticated, getProfile);
router.get('/verify-email/:verifyToken', verifyEmail);
router.get('/logout', logout);

// router.get(
//     "/google",
//     passport.authenticate("google",{
//         scope: ["https://www.googleapis.com/auth/plus.login","email"],
//     })
// );

// router.get(
//     "/google/callback",
//     passport.authenticate("google", {failureRedirect: "/login"}),
//     function(req, res){
//         console.log(req.user);
//         req.session.save(() => {
//             res.redirect("/");
//         });
//     }
// );


module.exports = router;