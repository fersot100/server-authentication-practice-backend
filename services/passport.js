const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Setup options for Local Strategy
const localOptions = {
    usernameField: 'email'
}

// Create local strategy
const localLogin = new LocalStrategy(localOptions, function (email, password, done){
    User.findOne({email: email}, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);

        user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if(!isMatch) return done(null, false);
            
            return done(null, user);
        })
    });
});

// Setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // See if the user ID in the payload exists in our database
    User.findById(payload.sub, function(err, user) {
        if (err) { return done(err, false)}
        if (user){
            // If it does, call 'done' with that other
            done(null, user);
        }else {
            // Otherwise, call done without a user object
            done(null, false);
        }
    });
});

// Tell passport to use this strategy, now any passport.authenticate() will use this strategy
passport.use(jwtLogin);
passport.use(localLogin);