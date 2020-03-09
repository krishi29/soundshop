const express = require("express"); //this imports the express package  installed within  application
const exphbs = require("express-handlebars");
const productModel = require("./model/datastore");
const bodyParser = require("body-parser");
var path = require('path');

//load the environment variable file
require("dotenv").config({ path: "./config/key.env" });

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

    if (req.query.type && element.type !== req.query.type) {
      select = false;
    }

    if (req.query.subType && element.categories.subType !== req.query.subType) {
      select = false;
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

//map each controller to the app object
app.use("/", generalController);
//app.use("/product", productController);

const port = process.env.PORT || 3000; ////process.env.PORT is used for HEROKU
app.listen(port, () => {
  console.log(`Web Server is up and running`);
});
