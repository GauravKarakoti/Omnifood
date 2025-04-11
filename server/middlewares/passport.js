const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/user");
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/google/callback',

    },
    async function (accessToken,refreshToken, profile, done) {

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
  clientID: process.env.LINKEDIN_KEY,
  clientSecret:  process.env.LINKEDIN_SECRET,
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
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL:"/twitter/callback",
},
function(token, tokenSecret, profile, done){
  User.findOrCreate({ twitterId: profile.id }, function(err, user){
    return done(err, user);
  });
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
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

});

module.exports = passport;