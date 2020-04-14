const express = require("express"); //this imports the express package  installed within  application
const exphbs = require("express-handlebars");
const productModel = require("./model/datastore");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session')
const fileUpload = require('express-fileupload');
var methodOverride = require('method-override')

//load the environment variable file
require('dotenv').config({ path: "./config/keys.env" });

const app = express(); // this creates  express app object
var hbs = exphbs.create({
  helpers: require('./config/handlebar-helpers')
});

//This tells express to set up our template engine has handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(fileUpload({
  limits: {
    fileSize: 50 * 1024 * 1024
  }
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'))

//serves static files
app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, '/views'));

//custom middleware functions
app.use((req,res,next)=>{
    if(req.query._method=="DELETE") {
        req.method="DELETE"
    }
    if(req.query._method=="PUT") {
        req.method="PUT"
    }
    next();
})

//Route for the Home Page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    headingInfo: "Home Page"
  });
});


//load controllers
const generalController = require("./controllers/general");
const productController = require("./controllers/products");

//custom middleware functions
app.use(session({
  secret: '${process.env.SECRET_KEY}',
  resave: false,
  saveUninitialized: true,
}))

//map each controller to the app object
app.use("/", generalController);
app.use("/products", productController);

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connected to MongoDB Database`);
})
.catch(err=>console.log(`Error occured when connecting to database ${err}`));


const port = process.env.PORT || 3000; ////process.env.PORT is used for HEROKU
app.listen(port, () => {
  console.log(`Web Server is up and running`);
});
