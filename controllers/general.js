const express = require("express");
const router = express.Router();
const userModel = require("../model/User");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../middleware/auth");
const appendUser = require("../middleware/appendUser");
const isAdmin = require("../middleware/adminAuth");

var customerInfo = [];

router.get("/", function(req, res) {
  res.render("general/home", {
    title: "home Page",
    category: fakeDB.category - section,
  });
});

router.get("/dashboard", isAuthenticated, appendUser, function(req, res) {
  res.render("general/dashboard", {
    title: "dashboard"
  });
});

router.get("/admin", isAuthenticated, appendUser, isAdmin, function(req, res) {
  res.render("general/admin", {
    title: "admin"
  });
});

//contact us route
router.get("/contact-us", (req, res) => {
  var inputError = true;
  res.render("general/contactUs.handlebars", {
    title: "Contact Page",
    valid: inputError,
  });
});

//process contact us form for when user submits form
router.post("/contact-us", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    message
  } = req.body;
  const emailRegex = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  var errorMessage = {},
    errorType = {};
  var inputError = false;

  if (firstName == "") {
    errorMessage.firstName = "!You must enter your firstName";
    inputError = true;
    errorType.firstName = true;
  }

  if (lastName == "") {
    errorMessage.lastName = "!You must enter your lastName";
    inputError = true;
    errorType.lastName = true;
  }

  if (email == "") {
    errorMessage.email = "!You must enter your email";
    inputError = true;
    errorType.email = true;
  } else if (!emailRegex.test(email)) {
    errorMessage.email = "!You must enter your email";
    inputError = true;
    errorType.email = true;
  }

  if (req.body.message == "") {
    errorMessage.message = "You must write something!!";
    inputError = true;
    errorType.message = true;
  }

  if (req.body.phoneNo == "") {
    errorMessage.message = "Please enter phone number";
    inputError = true;
    errorType.phoneNo = true;
  }

  if (inputError) {
    res.render("general/contactUs", {
      title: "contact Us",
      headingInfo: "Contact Us",
      valid: inputError,
      error: errorMessage,
      errorID: errorType,
    });
  } else {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      from: "krishnapatel2121@gmail.com",
      to: `${email}`,
      subject: "Contact Us Form Submit",
      html: `Vistor's Full Name ${firstName} ${lastName} <br>
     Vistor's Email Address ${email} <br>
     Vistor's message : ${message}<br>
    `,
    };

    //Asynchornous operation (who don't know how long this will take to execute)
    sgMail
      .send(msg)
      .then(() => {
        res.render("general/contactUs", {
          title: "contact Us",
          headingInfo: "Contact Us",
          valid: inputError,
        });
      })
      .catch((err) => {
        console.log(`Error ${err}`);
        res.render("general/contactUs", {
          title: "contact Us",
          headingInfo: "Contact Us",
          valid: true,
          error: err,
          errorID: errorType,
        });
      });
  }
});

module.exports = router;
