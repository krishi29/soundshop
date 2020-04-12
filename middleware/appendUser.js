const isLoggedIn = (req, res, next) => {
  res.locals.user = req.session.userInfo;

  if (res.locals.user) {
    res.locals.user.isAdmin = res.locals.user.type && res.locals.user.type === 'Admin'
    // console.log("In Middleware", res.locals.user, " for url ", req.url)
  }

  next();
};

module.exports = isLoggedIn;
