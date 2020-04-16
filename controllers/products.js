const express = require("express");
const router = express.Router();
const productList = require("./../model/datastore");
const productModel = require("../model/product");
const userCartModel = require("../model/UserCart");
const isAuthenticated = require("../middleware/auth");
const appendUser = require("../middleware/appendUser");
const isAdmin = require("../middleware/adminAuth");
const filesystem = require('fs')
var isClerkDelete = false;

const fetchAllProducts = async (user, filter = {}, userCart = {}) => {
  var products = await productModel.find(filter).exec();
  products = JSON.parse(JSON.stringify(products))

  if (user && Object.entries(userCart).length === 0) {
    userCart = await userCartModel.findOne({
      userId: user._id
    }).exec();
  }

  if (userCart) {
    const productsInCart = new Set(userCart.products);

    products = products.map((product) => {
      product['isInCart'] = productsInCart.has(product._id)
      return product
    });
  }

  return products;
}

const processFilters = (filters) => {
  if ('subType' in filters) {
    filters['categories.subType'] = filters['subType']
    delete filters['subType']
  }
  if ('brand' in filters) {
    filters['categories.brand'] = filters['brand']
    delete filters['brand']
  }
  return filters;
}

router.get("/all", appendUser, async (req, res) => {
  const allProducts = await fetchAllProducts()

  res.send(allProducts)
});

router.get("/", appendUser, async (req, res) => {
  const filters = req.query || {};

  const allProducts = await fetchAllProducts(req.session.userInfo, processFilters(filters))
  var message = req.session.message || {}

  // if (req.session) {
  //   message =
  // }

  res.render("products/productlist", {
    title: "Products",
    headingInfo: "Products Page",
    products: allProducts,
    message: message
  });
});

router.get("/add", isAuthenticated, appendUser, isAdmin, function(req, res) {
  res.render("products/add", {
    title: "Add Product",
    valid: true,
  });
});


router.get("/cart", isAuthenticated, appendUser, async (req, res) => {
  const user = req.session.userInfo
  const userCart = await userCartModel.findOne({
    userId: user._id
  }).exec();
  var products = []

  if (userCart) {
    const filter = {
      _id: userCart.products
    }
    products = await fetchAllProducts(req.session.userInfo, filter, userCart);
  }

  res.render("products/productcart", {
    title: "View Cart",
    products: products
  });
});

router.delete("/checkout", isAuthenticated, appendUser, async (req, res) => {
  const user = req.session.userInfo

  userCartModel.deleteOne({
    userId: user._id
  }, function(err, obj) {
    if (err) {
      console.log(`Cart can not be cleared: ${err}`)
      res.render('404', {
        url: req.url
      });
      req.session['message'] = {
        error: "Not able to checkout the cart."
      }
    }
    console.log(`Cart cleared successfully: ${err}`)
    res.redirect("/products/cart");
  });

});

router.post("/add", isAuthenticated, appendUser, isAdmin, function(req, res) {
  const productjson = req.body;
  var inputError = false;
  var errorType = {};
  var errorMessage = {};

  const productItem = {
    name: productjson.name,
    categories: {
      subType: productjson.subType,
      brand: productjson.brand
    },
    type: productjson.type,
    price: productjson.price,
    isBestSeller: productjson.isBestSeller ? true : false,
    description: productjson.description
  };

  if (!Array.isArray(req.files.images)) {
    req.files.images = [req.files.images]
  }

  // Images are uploaded
  if (req.files.images) {
    productItem["images"] = []

    req.files.images.map((image) => {
      productItem.images.push(image.name)

      image.mv(__dirname + '/../static/images/products/' + image.name, function(err) {
        if (err) {
          console.log(err);
          inputError = true
        } else {
          console.log("uploaded");
        }
      });
    });
  }

  if (!inputError) {
    const product = new productModel(productItem);
    product
      .save()
      .then((product) => {
        res.render("products/add", {
          title: "Add Product",
          message: `Product ${product.name} added successfully.`,
          valid: false,
        });
      })
      .catch((err) => console.log(`Error while inserting inventory ${err}`));
  } else {
    res.render("products/add", {
      title: "Add Product",
      error: errorMessage,
      errorID: errorType,
      valid: inputError,
    });
  }
});

router.get("/edit/:id", isAuthenticated, appendUser, isAdmin, function(req, res) {
  const productId = req.params.id;

  productModel.findOne({
    _id: productId
  }, function(err, obj) {
    if (err | !obj) {
      console.log(`Error occured while fetching product with id ${productId}: ${err}`)
      res.render('404', {
        url: req.url
      });
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


router.put("/edit/:id", isAuthenticated, appendUser, isAdmin, function(req, res) {
  const productId = req.params.id

  const productJson = req.body;
  var inputError = false;
  var errorType = {};
  var errorMessage = {};

  const productItem = {
    name: productJson.name,
    categories: {
      subType: productJson.subType,
      brand: productJson.brand
    },
    type: productJson.type,
    price: productJson.price,
    isBestSeller: productJson.isBestSeller ? true : false,
    description: productJson.description
  };

  if (!Array.isArray(req.files.images)) {
    req.files.images = [req.files.images]
  }

  // Images are uploaded
  if (req.files.images) {
    productItem["images"] = []

    req.files.images.map((image) => {
      productItem.images.push(image.name)

      image.mv(__dirname + '/../static/images/products/' + image.name, function(err) {
        if (err) {
          console.log(err);
          inputError = true
        } else {
          console.log("uploaded");
        }
      });
    });

  }

  if (!inputError) {
    productModel.updateOne({
        _id: productId
      }, productItem)
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

router.put("/add-cart/:userId/:productId", isAuthenticated, appendUser, async (req, res) => {
  const user = req.session.userInfo;
  const userId = req.params.userId;
  const productId = req.params.productId;

  if (!user) {
    res.redirect("/login");
    return;
  }

  if (!userId || !productId) {
    res.render("404");
    return;
  }

  var message = {};
  var allProducts = []
  var isError = false
  userCartModel.findOne({
      userId: userId
    })
    .then(async (userCart) => {
      var cartExists = true;
      if (!userCart) {
        cartExists = false;
        userCart = {
          email: user.email,
          userId: userId,
          products: []
        }
      }
      userCart.products.push(productId)
      userCart.products = Array.from(new Set(userCart.products));

      console.log(`User Cart Before Update, After Adding: ${userCart}`)

      if (cartExists) {
        userCartModel.updateOne({
            _id: userCart._id
          }, userCart)
          .then(async (userCartCreated) => {
            userCartUpdated = JSON.parse(JSON.stringify(userCartCreated));

            message = {
              success: "Product successfully added to the cart."
            }

            req.session.message = message
            res.redirect('/products')
          }).catch(async (err) => {
            console.log(`Error while fetching existing cart id for user: ${userId} & product: ${productId} with error ${err}`)
            isError = true
            message = {
              error: "Could not add product to the cart. Please try again."
            }

            req.session.message = message
            res.redirect('/products')
          });
      } else {
        const userCartSchema = new userCartModel(userCart);
        userCartSchema.save()
          .then((userCartCreated) => {
            userCartCreated = JSON.parse(JSON.stringify(userCartCreated));
            console.log(`User Cart Created: ${userCartCreated._id}`)
            message = {
              success: "Product successfully added to the cart."
            }

            req.session.message = message
            res.redirect('/products')
          }).catch(async (err) => {
            console.log(`Error while fetching existing cart id for user: ${userId} & product: ${productId}`)
            isError = true
            message = {
              error: "Could not add product to the cart. Please try again."
            }

            req.session.message = message
            res.redirect('/products')
          });
      }
    })
    .catch(async (err) => {
      console.log(`Error while fetching existing cart id for user: ${userId} & product: ${productId}: ${err}`)
      isError = true
      message = {
        error: "Could not add product to the cart. Please try again."
      }

      req.session.message = message
      res.redirect('/products')
    }).finally(() => {

    });
});

router.delete("/delete/:id", isAuthenticated, appendUser, isAdmin, function(req, res) {
  const productId = req.params.id;

  productModel.findOneAndDelete({
    _id: productId
  }, function(err, obj) {
    if (err) {
      console.log(`Error occured while deleting product with id ${productId}: ${err}`)
      res.render('404', {
        url: req.url
      });
      return;
    }

    const productJson = JSON.parse(JSON.stringify(obj));
    if (productJson.images) {
      productJson.images.map((imageName) => {
        console.log("Deleting file: ", __dirname + "/../static/images/products/" + imageName)
        filesystem.unlinkSync(__dirname + "/../static/images/products/" + imageName)
      })
    }

    res.redirect("/products");
  });
});

module.exports = router;
