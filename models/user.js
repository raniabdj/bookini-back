require("dotenv").config();
const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT = 10;

var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new Schema({

    fullName: {
        type: String
    },
    email: {
        type: String,
        required: [true, "The email field is required"],
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "The password field is required"],
    },
    address:{
        type: String,
        required: [true, "The address field is required"],
    },
    role:{
        type: String,
        required: [true, "The role field is required"],
        default:'client',
        enum:['admin','client']
    }

})

UserSchema.pre("save", function (next) {
    var user = this;
    if (user.isModified("password")) {
        bcrypt.genSalt(SALT, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

UserSchema.methods.generateToken = function (callBack) {
    const user = this;
    var token = jwt.sign(user._id.toHexString(), process.env.JWT_KEY);
    user.token = token;
    user.save(function (err, user) {
        if (err) return callBack(err);
        callBack(null, user);
    });
};

UserSchema.statics.findByToken = function (token, callBack) {
    const user = this;
    jwt.verify(token, process.env.JWT_KEY, function (err, decode) {
        user.findOne({_id: decode, token: token}, function (err, user) {
            if (err) return callBack(err);
            callBack(null, user);
        });
    });
};
const User = mongoose.model("User", UserSchema);
module.exports = {User};