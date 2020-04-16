const isAdmin = (req, res, next) => {
  if (!req.session.userInfo) {
    res.redirect("/login")
  }

  if (req.session.userInfo.type === "Admin") {
    next();
  }
};

module.exports = isAdmin;
