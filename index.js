const express = require("express"); //this imports the express package  installed within  application
const exphbs = require("express-handlebars");
const productModel = require("./model/datastore");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session')

//load the environment variable file
require('dotenv').config({ path: "./config/keys.env" });

const app = express(); // this creates  express app object

//This tells express to set up our template engine has handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//serves static files
app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, '/views'));

//Route for the Home Page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    headingInfo: "Home Page"
  });
});

app.get("/products", (req, res) => {
  var allproducts = productModel.getProducts();
  var selectedProducts = [];
  for (var i = 0; i < allproducts.length; i++) {
    var element = allproducts[i];
    var select = true;

    if (req.query.type && element.type !== req.query.type || req.query.selectBestSeller) {
      select = false;
    }

    if (req.query.subType && element.categories.subType !== req.query.subType || req.query.selectBestSeller) {
      select = false;
    }
    if (req.query.selectBestSeller && element.isBestSeller) {
      select = true;
    }

    if (select) {
      selectedProducts.push(element);
    }
  }
  res.render("products", {
    title: "Products",
    headingInfo: "Products Page",
    products: selectedProducts
  });
});

//load controllers
const generalController = require("./controllers/general");
//const productController = require("./controllers/product");

//custom middleware functions
app.use(session({
  secret: '${process.env.SECRET_KEY}',
  resave: false,
  saveUninitialized: true,
}))

//map each controller to the app object
app.use("/", generalController);
//app.use("/product", productController);

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connected to MongoDB Database`);
})
.catch(err=>console.log(`Error occured when connecting to database ${err}`));


const port = process.env.PORT || 3000; ////process.env.PORT is used for HEROKU
app.listen(port, () => {
  console.log(`Web Server is up and running`);
});
