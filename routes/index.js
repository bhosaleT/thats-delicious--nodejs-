const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeContoller");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const { catchErrors } = require("../handlers/errorHandlers");

// Do work here
// we first pass it to my middleware and then as a next parameter we pass it to homePage.
router.get("/", catchErrors(storeController.getStores));
router.get("/stores", catchErrors(storeController.getStores));
router.get("/add", authController.isLoggedIn, storeController.addStore);
router.post(
  "/add",
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post(
  "/add/:id",
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);
//
router.get("/reverse/:name", (req, res) => {
  const reversed = [...req.params.name].reverse().join("");
  res.send(reversed);
});

router.get("/stores/:id/edit", catchErrors(storeController.editStore));

router.get("/store/:slug", catchErrors(storeController.getStoreBySlug));

router.get("/tags", catchErrors(storeController.getStoresByTag));

router.get("/tags/:tag", catchErrors(storeController.getStoresByTag));

router.get("/login", userController.loginForm);
router.post("/login", authController.login);

router.get("/register", userController.registerForm);

//Validate the registration data
// register the user
// we need to log them in
router.post(
  "/register",
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get("/logout", authController.logout);

router.get("/account",authController.isLoggedIn,userController.account);
router.post('/account', catchErrors(userController.updateAccount));

module.exports = router;
