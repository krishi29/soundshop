const isLoggedIn = (req, res, next) => {
  res.locals.user = req.session.userInfo;
  if (req.path.startsWith("/sign-in") && req.session.userInfo) {
    res.locals.user = req.session.userInfo;
    res.redirect("/dashboard");
  } else if (req.session.userInfo) {
    res.locals.user = req.session.userInfo;

    next();
  } else if (req.path.startsWith("/sign-in")) {
    next();
  } else {
    res.redirect("/sign-in");
  }
};

module.exports = isLoggedIn;
