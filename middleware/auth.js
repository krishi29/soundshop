const isLoggedIn = (req, res, next) => {
  if (req.session.userInfo) {
    next();
  } else {
    res.redirect("/sign-in");
  }
};

module.exports = isLoggedIn;
