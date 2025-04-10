const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/user");
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""



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

passport.use(new LinkedInStrategy({
  clientID: LINKEDIN_KEY,
  clientSecret:  LINKEDIN_SECRET,
  callbackURL: "/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile'],
  state: true
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function(){
    return done(null, profile);
  });

}));

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL:"/twitter/callback",
},
function(token, tokenSecret, profile, done){
  User.findOrCreate({ twitterId: profile.id }, function(err, user){
    return done(err, user);
  });
}
));

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "/facebook/callback",
},
function(accessToken, refreshToken, profile, done){
  User.findOrCreate({facebookId: profile.id } , function(err, user){
    return done(err, user);
  })
}
))



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