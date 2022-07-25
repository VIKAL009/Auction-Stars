// JavaScript source code
const mongoose = require("mongoose");

const userSchema = {
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    account: {
        type: String,
        require: true
    },
    wallet: {
        type: Number,
        require:true
    }


};

const User = mongoose.model('User', userSchema);
module.exports = User;
