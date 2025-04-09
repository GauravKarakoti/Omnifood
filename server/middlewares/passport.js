const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/user");

GOOGLE_CLIENT_ID='790533275206-jlbkke7ne72r5goqkcpjcbm215hpla1e.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET='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'

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/google/callback',

    },
    async function (accessToken,refreshToken, profile, done) {
      console.log("Google strategy callback called");
      console.log(profile);
      // try {
      //   console.log(profile);
      //   const [user, created] = await User.findOrCreate({
      //     where: {
      //       googleId: profile.id || null,
      //     },
      //     defaults: {
      //       first: profile.name.givenName,
      //       last: profile.name.familyName,
      //       email: profile.emails[0].value,
      //     },
      //   });
      try{
        console.log(profile);
        
        done(null, profile);

      } catch(err){
        return done(err, null);
      }
      // } catch (err) {
      //   return console.error(err);
      // }
    }
  )
);

passport.serializeUser(function(user, done) {
    return done(null, user);
});

passport.deserializeUser(function(user , done){
  return done(null,user);
    // User.findById(id, function(err, user){
    //     done(err,user);
    // });
});

module.exports = passport;