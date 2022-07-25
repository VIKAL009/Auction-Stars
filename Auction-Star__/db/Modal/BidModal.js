// JavaScript source code
const mongoose = require("mongoose");

const bidSchema = {
    
    amount: {
        type: Number,
        require: true
    },
    productid: {
        type: String,
        require: true
    },
    userid: {
        type: String,
        require:true
    },
    username: {
        type: String,
        require:true
    }

};

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
