const isAdmin = (req, res, next) => {
  if (!req.session.userInfo) {
    res.redirect("/sign-in")
  }

  if (req.session.userInfo.type === "Admin") {
    next();
  }
};

module.exports = isAdmin;
