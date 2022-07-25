// JavaScript source code
const mongoose = require("mongoose");

const productSchema = {
    productname: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    colour: {
        type: String,
        require:true
    },
    used: {
        type: Number,
        require:true
    },
    auctiontime:{
        type: String,
        require: true
    },
    userid: {
        type: String,
        require:true
	}


};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
