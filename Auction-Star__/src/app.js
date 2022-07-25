// JavaScript source code
const express = require("express");
const app = express();
const path = require("path");
const port = 80;
const sessions = require("express-session");
const mongoose = require("mongoose");
const mongodbSession = require("connect-mongodb-session")(sessions);
const mongoUri = "mongodb://localhost:27017/Auction";
const bcrypt = require("bcryptjs");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
const User = require("../db/Modal/UserModal");
const Product = require("../db/Modal/ProductModal");
const Bid = require("../db/Modal/BidModal");
const moment = require("moment");

app.use(bodyParser.urlencoded({
    extended: true
}));

//---------------------------------------------------------express related stuff
app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: false }));

const store = new mongodbSession({
    uri: mongoUri,
    collection: "mySessions"
});

app.use(sessions({
    secret: 'key that sign cookie',
    resave: false,
    saveUninitialized: false,
    store: store
}));


//----------------------------------------------------------set view Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


//-----------------------------------------------------------Database Connection
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("Connection Succesfull"))
    .catch((error) => console.log(console.log(error)));



const isAuth = (req, res, next) => {
    if (req.session.isAuth)
        next()
    else {
        res.redirect('/login');
    }
}



//-------------------------------------------------------------ROUTING END POINTS ------------------------------


//---------------------------------HOME  / GET---------------------
app.get("/",async (req, res) => {
    const msg = "This is home page ";
    const isLogin = req.session.isAuth;
    
    var userName = "Ravi";
    if (isLogin==true)
        userName = req.session.username;
   // console.log(userName);
    let products = await Product.find();
    console.log(products);
    const params = { 'msg': msg, 'username': userName, 'isLogin': isLogin, 'products': products };
    res.status(200).render("index.ejs",params);
});


//---------------------------------PROFILE GET---------------------
app.get("/profile", isAuth, async (req, res) => {
    const msg = "This is profile page ";
    const isLogin = req.session.isAuth;

    var userName = null;
    if (isLogin == true)
        userName = req.session.username;
    const userId = req.session.userId;
    let user = await User.findOne({_id:userId  });
  //  console.log(user);
//    console.log(userName);

    const params = { 'msg': msg, 'username': userName, 'isLogin': isLogin,'userid':userId,'address':user.address,'account':user.account,'wallet':user.wallet };

    res.status(200).render("profile.ejs", params);
});


//---------------------------------ABOUT GET---------------------
app.get("/about",  async (req, res) => {
    const msg = "This is about page ";
    const isLogin = req.session.isAuth;

    var userName = "Ravi";
    if (isLogin == true)
        userName = req.session.username;
    //console.log(userName);
    const params = { 'msg': msg, 'username': userName, 'isLogin': isLogin };

    res.status(200).render("about.ejs", params);
});


//---------------------------------CONTACT GET---------------------
app.get("/contact", async (req, res) => {
    const msg = "This is contact page ";
    const isLogin = req.session.isAuth;

    var userName = null;
    if (isLogin == true)
        userName = req.session.username;
    //console.log(userName);
    const params = { 'msg': msg, 'username': userName, 'isLogin': isLogin };

    res.status(200).render("contact.ejs", params);
});


//---------------------------------ADD PRODUCT GET------------------------------------------------------------
app.get("/addProduct", async (req, res) => {
    const msg = "This is add product page ";
    const isLogin = req.session.isAuth;

    var userName = null;
    if (isLogin == true)
        userName = req.session.username;

    //console.log(userName);
    const params = { 'msg': msg, 'username': userName, 'isLogin': isLogin };

    res.status(200).render("addProduct.ejs", params);
});



//--------------------------------- PRODUCT INFO GET------------------------------------------------------------
app.get("/productInfo/:id", isAuth, async (req, res) => {

    const productid = req.params.id;
    const msg = "This is product Info  page ";
    let productArr = await Product.find({ _id: productid });
    //console.log(productArr);
    let product = productArr[0];
    const isLogin = req.session.isAuth;

    const now = moment();
    const auctionTime = moment(product.auctiontime);
   // console.log(now);
   // console.log(auctionTime);
    const diff = auctionTime.diff(now);
   // console.log(diff);
    const diffDuration = moment.duration(diff);
    var status = "sold";//status 0 means sold 1 means live 2 means in future
    var Days = diffDuration.days();
    var Hours = diffDuration.hours();
    var Minutes = diffDuration.minutes();

    if (diff < 0)
    {
        status = "sold";
        if (Days == 0 && Hours == 0 && Math.abs(Minutes) < 10)
            status = "live";
    }
    else
        status = "infuture";

    var userName = null;
    if (isLogin == true)
        userName = req.session.username;

    const params = { 'msg': msg, 'username': userName, 'isLogin': isLogin, 'status': status, 'days': Days, 'hours': Hours, 'minutes': Minutes, 'product': product };
    res.status(200).render("productInfo.ejs", params);
});

//
app.get("/makebid/:id", isAuth, async (req, res) => {

    const productid = req.params.id;
    const msg = "This is make bid page ";
    let productArr = await Product.find({ _id: productid });
    //console.log(productArr);
    let product = productArr[0];
    const isLogin = req.session.isAuth;

    const now = moment();
    const auctionTime = moment(product.auctiontime);
    //console.log(now);
   // console.log(auctionTime);
    const diff = auctionTime.diff(now);
    //console.log(diff);
    const diffDuration = moment.duration(diff);
    var status = "sold";//status 0 means sold 1 means live 2 means in future
    var Days = diffDuration.days();
    var Hours = diffDuration.hours();
    var Minutes = diffDuration.minutes();

    if (diff < 0) {
        status = "sold";
        if (Days == 0 && Hours==0 && Math.abs(Minutes) < 10)
            status = "live";
    }
    else
        status = "infuture";

    var userName = null;
    if (isLogin == true)
        userName = req.session.username;

    let bidArr = await Bid.find({ productid: product._id });
    //console.log(bidArr);

    const params = { 'msg': msg, 'username': userName, 'isLogin': isLogin, 'status': status, 'days': Days, 'hours': Hours, 'minutes': Minutes, 'product': product, 'bids': bidArr };
    res.status(200).render("makebid.ejs", params);
});



//------------------------------------------------------------------------POST METHODS------------------------------------------------


//---------------------------------LOGIN POST------------------------------------------------------------
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    //console.log(user);
    if (!user) {
        console.log("email not found in database ");
    }
    //const enter = 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("Wrong Pass");
    }
    else {
        req.session.isAuth = true;
        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect("/",);
    }

});


//---------------------------------REGISTER POST------------------------------------------------------------
app.post("/register", jsonParser, async(req, res) => {
    const { username, email, password,gender,address,account } = req.body;
    let user = await User.findOne({ email });
    const amount = 0;
    //console.log(req.file);
    if (user) {
        res.redirect("/");

    }
    const hashpass = await bcrypt.hash(password, 10);
    user = new User({
        username,
        email,
        password: hashpass,
        gender,
        address,
        account,
        wallet:amount
        
    });

    await user.save();

    res.status(200).redirect("/");
});


//---------------------------------ADD PRODUCT POST------------------------------------------------------------
app.post("/addProduct", jsonParser, async (req, res) => {
    const { productname, category, price, description, colour, used, auctiontime } = req.body;
    const userid = req.session.userId;
    product = new Product({
        productname,
        category,
        price,
        description,
        colour,
        used,
        auctiontime,
        userid

    });

    await product.save();

    res.status(200).redirect("/");
});


//---------------------------------Add Money in wallet-----------------------------------------------
app.post("/addmoney", async (req, res) => {
    var {  password,amount } = req.body;
    let user = await User.findOne({ _id:req.session.userId });

    amount = Number(amount);
    //const enter = 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("Wrong Pass");
    }
    else {
        //add money to wallet 
        let prev = Number(user.wallet);
        let newAmount = prev + amount;
        console.log(await User.update({ '_id': req.session.userId }, { $set: { 'wallet': newAmount } }));
    //    console.log(newAmount);
    }
    res.redirect("/profile");

});


//-------------------------------Add Bid --------------------------------------
app.post("/addbid", jsonParser, async (req, res) => {
    const { amount, productid  } = req.body;
    const userid = req.session.userId;
    const username = req.session.username;
    bid = new Bid({
        amount,
        productid,
        userid,
        username,

    });

    await bid.save();

    res.status(200).redirect('/makebid/'+productid);
});




//---------------------------------LOGOUT------------------------------------------------------------

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {

        res.redirect("/");
    });
});





//---------------------------------------------------------------START SERVER ------------------------------
app.listen(port, () => {
    console.log(` app listening at http://localhost:${port}`);
});
