const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys =    require('../configs/keys');

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    })
})

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googlClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({ googleId: profile.id })   
        if(existingUser) {
            console.log("Hello", profile)
            done(null, existingUser);
        }
        else { 
            console.log('create a user')               
            const user = await new User({ 
                googleId: profile.id,
                profilePicture: profile.photos[0].value
            }).save()
            done(null, user);
        }
    }
));