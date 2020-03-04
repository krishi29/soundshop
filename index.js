const express = require("express"); //this imports the express package  installed within  application

const app = express(); // this creates  express app object

const exphbs = require("express-handlebars");

const productModel = require("./model/products");

//This tells express to set up our template engine has handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//serves static files

app.use(express.static("static"));

//Route for the Home Page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    headingInfo: "Home Page"
  });
});

app.get("/contact-us", (req, res) => {
  res.render("contact", {
    title: "Contact",
    headingInfo: "Contact Us Page"
  });
});

app.get("/products", (req, res) => {
  var allproducts = productModel.getAllProducts();
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

app.get("/sign-up", (req, res) => {
  res.render("signUp", {
    title: "Sign Up",
    headingInfo: "Sign Up Page"
  });
});

app.get("/sign-In", (req, res) => {
  res.render("signIn", {
    title: "Sign In",
    headingInfo: "Sign In Page"
  });
});

const PORT = 3000;
//This creates an Express Web Server that listens to HTTP Reuqest on port 3000
app.listen(PORT, () => {
  console.log(`Web Server Started`);
});
