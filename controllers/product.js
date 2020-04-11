const express = require("express");
const router = express.Router();
const productList = require("./../model/datastore");
const productModel = require("../model/product");
const isAuthenticated = require("../middleware/auth");
const adminCheck = require("../middleware/authorization");
var isClerkDelete = false;

router.get("/", (req, res) => {
  var allproducts = productList.getProducts();
  var selectedProducts = [];
  for (var i = 0; i < allproducts.length; i++) {
    var element = allproducts[i];
    var select = true;

    if (
      (req.query.type && element.type !== req.query.type) ||
      req.query.selectBestSeller
    ) {
      select = false;
    }

    if (
      (req.query.subType && element.categories.subType !== req.query.subType) ||
      req.query.selectBestSeller
    ) {
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
    products: selectedProducts,
  });
});

router.get("/add", function (req, res) {
  res.render("product/add", {
    title: "Add Product",
    valid: true,
  });
});

router.post("/add", function (req, res) {
  const productjson = req.body;
  var inputError = false;
  var errorType = {};
  var errorMessage = {};
  console.log(req.body);
  if (!inputError) {
    const productItem = {
      name: productjson.name,
      categories: {
          subType: productjson.subType,
          brand: productjson.brand
      },
      type: productjson.type,
      price: productjson.price,
      isBestSeller: productjson.isBestSeller ? true : false,
      description: productjson.description,
    };
    const product = new productModel(productItem);
    product
      .save()
      .then((product) => {
        console.log(product);
      })
      .catch((err) => console.log(`Error while inserting inventory ${err}`));
  }
  res.render("product/add", {
    title: "Add Product",
    error: errorMessage,
    errorID: errorType,
    valid: inputError,
  });
});




// router.delete('/delete/:id',  function (req, res) {
   
//     //delete product from the Database
//     productModel.productModel.delete({
//             _id: req.params.id
//         })
//         .then(() => {
//             res.redirect("/product");
//         })
//         .catch(err => console.log(`Error happened when deleting data from the database :${err}`));

//     productModel.isClerkDelete = false
// });


// res.render("product/delete", {
//     title: "Delete Product",isAuthenticated,adminCheck,
//     error: errorMessage,
//     errorID: errorType,
//     valid: inputError,
// });

// router.get('/update', function (req, res) {
//     productModel.isClerkDelete = false;
//     res.redirect("/product");
// });

module.exports = router;
