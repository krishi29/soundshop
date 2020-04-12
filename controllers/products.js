const express = require("express");
const router = express.Router();
const productList = require("./../model/datastore");
const productModel = require("../model/product");
const isAuthenticated = require("../middleware/auth");
const appendUser = require("../middleware/appendUser");
const isAdmin = require("../middleware/adminAuth");
var isClerkDelete = false;

const filterProducts = (products, query) => {
  var selectedProducts = [];
  for (var i = 0; i < products.length; i++) {
    var element = JSON.parse(JSON.stringify(products[i]));
    var select = true;

    if (
      (query.productType && element.type !== query.productType) || query.selectBestSeller
    ) {
      select = false;
    }

    if (
      (query.subType && element.categories.subType !== query.subType) || query.selectBestSeller
    ) {
      select = false;
    }
    if (query.selectBestSeller && element.isBestSeller) {
      select = true;
    }

    if (select) {
      selectedProducts.push(element);
    }
  }

  return selectedProducts;
}

router.get("/insert-all", (req, res) => {
  var allProducts = productList.getProducts();
  productModel.find()
  .then((products) => res.send(products))
  .catch((err) => res.send(err))
});

router.get("/", appendUser, (req, res) => {
  productModel.find()
  .then((allProducts) => {
    // console.log(allProducts);
    res.render("products/productlist", {
      title: "Products",
      headingInfo: "Products Page",
      products: filterProducts(allProducts, req.query)
    });
  })
  .catch((err) => {
    console.log(`Error while fetching list of products: ${err}`)
    res.render("products/productlist", {
      title: "Products",
      headingInfo: "Products Page",
      products: []
    });
  })
});

router.get("/add", isAuthenticated, appendUser, isAdmin, function (req, res) {
  res.render("products/add", {
    title: "Add Product",
    valid: true,
  });
});

router.post("/add", isAuthenticated, appendUser, isAdmin, function (req, res) {
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
  res.render("products/add", {
    title: "Add Product",
    error: errorMessage,
    errorID: errorType,
    valid: inputError,
  });
});

router.get("/edit/:id", isAuthenticated, appendUser, isAdmin, function (req, res) {
  const productId = req.params.id;

  productModel.findOne({
    _id: productId
  }, function(err,obj) {
    if (err | !obj) {
      console.log(`Error occured while fetching product with id ${productId}: ${err}`)
      res.render('404', { url: req.url });
      return;
    }
    const productJson = JSON.parse(JSON.stringify(obj));

    res.render("products/edit", {
      title: "Products Page",
      product: {
        images: productJson.images,
        dateCreated: productJson.dateCreated,
        _id: productJson._id,
        name: productJson.name,
        categories: productJson.categories,
        type: productJson.type,
        price: parseInt(productJson.price),
        isBestSeller: productJson.isBestSeller,
        description: productJson.description,
        __v: parseInt(productJson.__v)
      },
      valid: false,
    });
  });
});


router.put("/edit/:id", isAuthenticated, appendUser, isAdmin, function (req, res) {
  const productId = req.params.id

  const productJson = req.body;
  var inputError = false;
  var errorType = {};
  var errorMessage = {};

  console.log(productJson)
  if (!inputError) {
    const productItem = {
      name: productJson.name,
      categories: {
        subType: productJson.subType,
        brand: productJson.brand
      },
      type: productJson.type,
      price: productJson.price,
      isBestSeller: productJson.isBestSeller ? true : false,
      description: productJson.description,
    };

    productModel.updateOne({_id: productId}, productItem)
    .then((product) => {
      // console.log(`Product successfull edited: ${product}`)
      res.redirect("/products");
    })
    .catch((err) => {
      console.log(`Error while updating product ${productId} and value ${productItem} ${err}`)

      res.render("products/edit", {
        title: "Products Page",
        product: productJson,
        valid: true
      });
    });
  } else {
    res.render("products/edit", {
      title: "Products Page",
      product: productJson,
      valid: inputError
    });
  }
});

router.delete("/delete/:id", isAuthenticated, appendUser, isAdmin, function (req, res) {
  const productId = req.params.id;

  productModel.deleteOne({
    _id: productId
  }, function(err,obj) {
    if (err) {
      console.log(`Error occured while deleting product with id ${productId}: ${err}`)
      res.render('404', { url: req.url });
      return;
    }

    res.redirect("/products");
  });
});

module.exports = router;
