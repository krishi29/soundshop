const express = require("express");
const router = express.Router();
const userModel = require("../model/User");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../middleware/auth");
const appendUser = require("../middleware/appendUser");
const isAdmin = require("../middleware/adminAuth");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailRegex = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

const validateInputForContactUs = (details) => {
  const {
    firstName,
    lastName,
    email,
    message,
    phoneNo
  } = details;

  var errorMessage = {};
  var hasError = false;

  if (!firstName) {
    errorMessage.firstName = "You must enter your First Name.";
    hasError = true;
  }

  if (!lastName) {
    errorMessage.lastName = "You must enter your Last name";
    hasError = true;
  }

  if (!email) {
    errorMessage.email = "You must enter your email";
    hasError = true;
  } else if (!emailRegex.test(email)) {
    errorMessage.email = "You must enter a valid email address.";
    hasError = true;
  }

  if (!message) {
    errorMessage.message = "You must write something!!";
    hasError = true;
  }

  if (!phoneNo) {
    errorMessage.phoneNo = "Please enter your phone number";
    hasError = true;
  }

  return {
    contactDetails: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNo: phoneNo,
      message: message
    },
    errorMessage: errorMessage,
    hasError: hasError
  }
}

router.get("/", function(req, res) {
  res.render("general/home", {
    title: "home Page",
    category: fakeDB.category - section,
  });
});

router.get("/dashboard", isAuthenticated, appendUser, function(req, res) {
  res.render("general/dashboard", {
    title: "Dashboard"
  });
});

router.get("/admin", isAuthenticated, appendUser, isAdmin, function(req, res) {
  res.render("general/admin", {
    title: "Admin Dashboard"
  });
});

router.get("/contact-us", (req, res) => {
  res.render("general/contactUs.handlebars", {
    title: "Contact Page",
    hasError: true,
  });
});

router.post("/contact-us", async (req, res) => {
  const contactUsValidation = validateInputForContactUs(req.body);

  if (contactUsValidation.hasError) {
    res.render("general/contactUs", {
      title: "Contact Us",
      hasError: contactUsValidation.hasError,
      error: contactUsValidation.errorMessage,
    });
    return
  }

  const msg = {
    to: "krishnapatel2121@gmail.com",
    from: `${contactUsValidation.contactDetails.email}`,
    subject: "Contact Us Form Submit",
    html: `Vistor's Full Name ${contactUsValidation.contactDetails.firstName} ${contactUsValidation.contactDetails.lastName} <br>
     Vistor's Email Address ${contactUsValidation.contactDetails.email} <br>
     Vistor's message : ${contactUsValidation.contactDetails.message}<br>
    `,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log(`Contact email successfully sent to the Admin from ${contactUsValidation.contactDetails.email}`)
      res.render("general/contactUs", {
        title: "Contact Us",
        hasError: contactUsValidation.hasError
      });
    })
    .catch((err) => {
      console.log(`Error while sending email to Admin from ${contactUsValidation.contactDetails.email}: ${err}`);
      res.render("general/contactUs", {
        title: "Contact Us",
        hasError: true,
        error: {
          serverError: err.message
        }
      });
    });
});

module.exports = router;
