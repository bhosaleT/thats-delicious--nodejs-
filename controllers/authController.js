const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const promisify = require("es6-promisify");

const User = mongoose.model("User");
exports.login = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Failed Login",
  successRedirect: "/",
  successFlash: "You are now logged in!"
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out");
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  //first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on
    return;
  }
  req.flash("error", "You must be logged in");
  res.redirect("/login");
};

exports.forgot = async (req, res) => {
  /*TODO:
1. Check if the email exists in our database.
2. IF it does then we will give it a token to the user and set a timer only in that timer the token
is useful
*/
  const user = await User.findOne({
    email: req.body.email
  });
  // if no user
  if (!user) {
    req.flash("error", "No account with that email exists");
    return res.redirect("/login");
  }
  // if the user does exist
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  //3. send them an email witht the token
  const resetURL = `http://${req.headers.host}/account/reset/${
    user.resetPasswordToken
  }`;
  req.flash(
    "success",
    `You have been emailed a password reset link ${resetURL}`
  );
  //4. redirect to login page
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const user = User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash("error", "Password reset is invalid or has expired");
    return res.redirect("/login");
  }
  //if there is a user, show the reset password form
  res.render("reset", { title: "Reset your Password" });
};

exports.confirmPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    next();
    return;
  }
  req.flash("error", "Passwords do not match!");
  res.redirect("back");
};

exports.update = async (req, res) => {
  // FINALLY UPDATE THE PASSWORD.
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash("error", "Password reset is invalid or has expired");
    return res.redirect("/login");
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', `Password update was successful`);
  res.redirect('/');
};
