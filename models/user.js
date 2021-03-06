const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


//Define model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

// On save hook, encrypt password
userSchema.pre('save', function(next) {
    
    // Get access to user model
    const user = this;
    
    //Generate salt, then run callback
    bcrypt.genSalt(10, function(err, salt) {
        if(err) return next(err);
        
        //Encrypt password using salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);

            //Overwrite password with encrypted password
            user.password = hash;
            
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

//Create the model class
const model = mongoose.model('user', userSchema);


//Export the model
module.exports = model;