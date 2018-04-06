const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function (req,res,next){
    res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next){
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password'});
    }

    const User = require('../models/user');
    User.findOne({email: email}, (err, existingUser) => {
        if (err) { return next(err);}
        // See if a user with the given email exists
        if (existingUser) {
            // If a user with email does exist, return an error
            return res.status(422).send({error: 'Email is in use'});
        }
         
        // If a user with email does NOT exist, create and save user record  
        const user = new User({
            email: email,
            password: password
        });

        user.save(err => {
            if (err) return next(err);
            res.json({token: tokenForUser(user)});
        });

    });
}