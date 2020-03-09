const express = require("express");
const router = express.Router();

// //home route
// router.get("/",(req,res)=>{

//     res.render("general/home",{
//         title:"Home Page"
//     });
// });

// //contact us route
// router.get("/contact-us",(req,res)=>{

//     res.render("general/contactUs",{
//         title:"Contact Page"
//     });
// });

// //process contact us form for when user submits form
// router.post("/contact-us",(req,res)=>{

//     const {firstName,lastName,email,message} = req.body;

//     const sgMail = require('@sendgrid/mail');
//     sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
//     const msg = {
//     to: `krishnapatel2121@gmail.com`,
//     from: `${email}`,
//     subject: 'Contact Us Form Submit',
//     html:
//     `Vistor's Full Name ${firstName} ${lastName} <br>
//      Vistor's Email Address ${email} <br>
//      Vistor's message : ${message}<br>
//     `,
//     };

//     //validation

//     if(firstName=='' ||firstName==undefined ||firstName=null)

//     //Asynchornous operation (who don't know how long this will take to execute)
//     sgMail.send(msg)
//     .then(()=>{
//         res.redirect("/");
//     })
//     .catch(err=>{
//         console.log(`Error ${err}`);
//     });

// });

// module.exports = router;

//load productModel
const fakeDB = require("./../model/datastore");

var customerInfo = [];

router.get("/", function(req, res) {
  res.render("general/home", {
    title: "home Page",
    category: fakeDB.category - section
  });
});

router.get("/sign-up", function(req, res) {
  var inputError = true;
  res.render("general/signUp", {
    title: "Customer signUp",
    valid: inputError
  });
});

//Handle the registration post data
router.post("/sign-up", (req, res) => {
  //descturing
  var { yourName, password, passwordagain, email } = req.body;

  const nameRegex = /^[ a-zA-Z]+$/;
  const passwordRegex = /^(?!\d+$)(?![a-zA-Z]+$)[\w]{6,16}$/;
  const emailRegex = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  var errorType = {};
  var errorMessage = {};
  var inputData = {};
  var inputError = false;

  //validation
  if (yourName == "" || yourName == undefined || yourName == null) {
    errorMessage.firstname = "!You must enter your yourName";

    inputError = true;
    errorType.yourName = true;
  }
  // else if (!nameRegex.test(firstname)) {
  //   errorMessage.firstname = "!letter or space only";
  //   inputError = true;
  //   errorType.lastname = true;
  // }
  inputData.yourName = yourName;

  if (password == "") {
    errorMessage.password = "!You must enter password";
    inputError = true;
    errorType.password = true;
  } else if (req.body.password.length < 6) {
    errorMessage.password = "!You must enter 8-14 charactors";
    inputError = true;
    errorType.password = true;
  } //else if (!passwordRegex.test(password)) {
  // console.log(password, inputError, RegExp(passwordRegex));
  // errorMessage.password = "!8-14 characters, letters and numbers only";
  //inputError = true;
  //errorType.password = true;
  //}
  else inputData.password = password;

  if (passwordagain == "") {
    errorMessage.passwordagain = "!You must enter password again";
    inputError = true;
    errorType.passwordagain = true;
  } else if (passwordagain !== req.body.password) {
    inputError = true;
    errorType.passwordagain = true;
    errorMessage.passwordagain = "!Password does not match";
  } else inputData.passwordagain = passwordagain;

  if (email == "") {
    errorMessage.email = "!You must enter your email";
    inputError = true;
    errorType.email = true;
  } else if (!emailRegex.test(email)) {
    errorMessage.email = "!email format error";
    inputError = true;
    errorType.email = true;
  }
  inputData.email = email;

  //Asynchornous operation (who don't know how long this will take to execute)
  if (!inputError) {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      from: "krishnapatel2121@gmail.com",
      to: `${email}`,
      subject: "registration information",
      // text: 'and easy to do anywhere, even with Node.js',
      html: `
            Name: ${yourName} <br>
            Email: ${email}<br>
            Password: ${password}<br>
            `
    };

    sgMail
      .send(msg)
      .then(() => {
        // res.redirect("/");
        customerInfo.push({});
        customerInfo[customerInfo.length - 1].id = customerInfo.length;
        customerInfo[customerInfo.length - 1].yourName = yourName;
        customerInfo[customerInfo.length - 1].email = email;
        customerInfo[customerInfo.length - 1].password = password;
      })

      .catch(err => {
        console.log(`Error ${err}`);
      });
  }

  res.render("general/signUp", {
    title: "Customer signUp",
    error: errorMessage,
    errorID: errorType,
    data: inputData,
    valid: inputError
  });
  inputError = false;
});

router.get("/sign-in", (req, res) => {
  res.render("general/signIn", {
    title: "Sign In",
    headingInfo: "Sign In Page",
    valid: true
  });
});

router.post("/sign-in", (req, res) => {
  var { password, email } = req.body;
  const emailRegex = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  var inputError = false;
  var errorMessage = {},
    errorType = {};

  if (email == "") {
    errorMessage.email = "!You must enter your email";
    inputError = true;
    errorType.email = true;
  } else if (!emailRegex.test(email)) {
    errorMessage.email = "!email format error";
    inputError = true;
    errorType.email = true;
  }
  if (password == "" || password == undefined || password == null) {
    errorMessage.password = "!You must enter valid password";
    inputError = true;
    errorType.password = true;
  } else if (req.body.password.length < 6) {
    errorMessage.password = "!You must enter 6-16 charactors";
    inputError = true;
    errorType.password = true;
  }

  res.render("general/signIn", {
    title: "Sign In",
    headingInfo: "Sign In Page",
    valid: inputError,
    error: errorMessage,
    errorID: errorType
  });
});

//contact us route

router.get("/contact-us", (req, res) => {
  var inputError = true;
  res.render("/general/contactUs", {
    title: "Contact Page",
    valid: inputError
  });
});

//process contact us form for when user submits form
router.post("/contact-us", (req, res) => {
  const { firstName, lastName, email, message } = req.body;
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
    errorID: errorType
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
    `
    };

    //Asynchornous operation (who don't know how long this will take to execute)
    sgMail
      .send(msg)
      .then(() => {
        res.render("general/contactUs", {
    title: "contact Us",
    headingInfo: "Contact Us",
    valid: inputError

    });
      })
      .catch(err => {
        console.log(`Error ${err}`);
        res.render("general/contactUs", {
            title: "contact Us",
            headingInfo: "Contact Us",
            valid: true,
            error: err,
            errorID: errorType
            });
      });
  }
});

module.exports = router;
