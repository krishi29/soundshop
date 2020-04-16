const express = require("express");
const router = express.Router();
const userModel = require("../model/User");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const passwordRegex = /^(?!\d+$)(?![a-zA-Z]+$)[\w]{6,16}$/;
const emailRegex = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

const validateInputForRegister = (userDetails) => {
  const {
    userName,
    password,
    passwordVerify,
    email
  } = userDetails;
  var errorMessage = {};
  var isError = false;

  if (!userName) {
    errorMessage.userName = "You must enter your Name.";
    isError = true;
  }

  if (!password) {
    errorMessage.password = "You must enter a valid password.";
    isError = true;
  } else if (!passwordRegex.test(password)) {
    console.log(password, isError, RegExp(passwordRegex));
    errorMessage.password = "Password must have: 6-14 characters, letters and numbers only. No special characters allowed.";
    isError = true;
  }

  if (!passwordVerify) {
    errorMessage.passwordVerify = "You must verify your password again.";
    isError = true;
  } else if (passwordVerify !== password) {
    isError = true;
    errorMessage.passwordVerify = "Password does not match.";
  }

  if (!email) {
    errorMessage.email = "You must enter your email.";
    isError = true;
  } else if (!emailRegex.test(email)) {
    errorMessage.email = "Please enter a valid email.";
    isError = true;
  }

  return {
    user: {
      name: userName,
      email: email,
      password: password,
      isAdmin: false
    },
    errorMessage: errorMessage,
    hasError: isError
  }
}

const validateInputForLogin = (userDetails) => {
  const {
    email,
    password
  } = userDetails;

  var errorMessage = {};
  var isError = false;

  if (!email) {
    errorMessage.email = "You must enter your email.";
    isError = true;
  } else if (!emailRegex.test(email)) {
    errorMessage.email = "Please enter a valid email.";
    isError = true;
  }

  if (!password) {
    errorMessage.password = "You must enter a valid password.";
    isError = true;
  } else if (!passwordRegex.test(password)) {
    // console.log(password, isError, RegExp(passwordRegex));
    errorMessage.password = "Password must have: 6-14 characters, letters and numbers only. No special characters allowed.";
    isError = true;
  }

  return {
    user: {
      email: email,
      password: password
    },
    errorMessage: errorMessage,
    hasError: isError
  }
}

// Get on register to load the user registration page.
router.get("/register", (req, res) => {
  res.render("users/register", {
    title: "Customer Registration Page",
    hasError: true,
  });
});

router.get("/login", (req, res) => {
  res.render("users/login", {
    title: "Log In Page",
    hasError: true
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/users/login")
});

router.post("/register", async (req, res) => {
  const validatedResult = validateInputForRegister(req.body);

  if (validatedResult.hasError) {
    res.render("users/register", {
      title: "Customer Registration Page",
      error: validatedResult.errorMessage,
      input: req.body,
      hasError: validatedResult.hasError,
    });
    return;
  }

  const user = new userModel(validatedResult.user);
  user.save()
    .then((user) => {
      console.log(`User ${user.email} successfully created with id: ${user._id}`);

      res.render("users/register", {
        title: "Customer Registration Page",
        hasError: validatedResult.hasError,
      });

      const msg = {
        from: "krishnapatel2121@gmail.com",
        to: `${validatedResult.user.email}`,
        subject: "registration information",
        // text: 'and easy to do anywhere, even with Node.js',
        html: `Name: ${validatedResult.user.userName} <br>
               Email: ${validatedResult.user.email}<br>`
      };

      sgMail.send(msg)
        .then(() => console.log(`Email sent successfully to ${user.email}`))
        .catch((err) => console.log(`Error while sending registration email: ${err}`));
    })
    .catch((err) => {
      console.log(`Error while creating a new user: ${err}`)

      res.render("users/register", {
        title: "Customer Registration Page",
        hasError: true,
        error: {
          mongodb: err.message
        }
      });
    });
});

router.post("/login", (req, res) => {
  const loginValidation = validateInputForLogin(req.body);

  if (loginValidation.hasError) {
    res.render("users/login", {
      title: "Log In",
      hasError: loginValidation.hasError,
      error: loginValidation.errorMessage
    });
    return;
  }

  userModel.findOne({
      email: loginValidation.user.email
    })
    .then((userModel) => {
      console.log(`User's information found in database!`);
      console.log(userModel);
      bcrypt
        .compare(req.body.password, userModel.password)
        .then((isMatched) => {
          console.log(`Password matched: `, isMatched);
          if (!isMatched) {
            res.render("users/login", {
              title: "Log In",
              hasError: true,
              error: {
                invalid: "Please check the password and try again."
              }
            });
            return;
          }
          //create our session
          req.session.userInfo = userModel;
          console.log(`Loading dashboard page for: ${userModel}`)

          if (userModel.type === 'Admin') {
            res.redirect("/admin");
          } else {
            res.redirect("/dashboard");
          }
        })
        .catch((err) => {
          console.log(`Error while hashing using bcryptjs: `, err);
          res.render("users/login", {
            title: "Log In",
            hasError: true,
            error: {
              invalid: "Error while hashing the password."
            }
          });
        });
    })
    .catch((err) => {
      console.log(`Error while fetching user's information in database!`, err);
      res.render("users/login", {
        title: "Log In",
        hasError: true,
        error: {
          invalid: "No user found with the given email."
        }
      });
    });
});

module.exports = router;
