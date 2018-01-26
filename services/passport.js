const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//Create JWT strategy
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

// Tell passport to use this strategy
passport.use(jwtLogin);