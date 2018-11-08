const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeContoller");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

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

router.get("/account", authController.isLoggedIn, userController.account);
router.post("/account", catchErrors(userController.updateAccount));

router.post("/account/forgot", catchErrors(authController.forgot));

router.get("/account/reset/:token", catchErrors(authController.reset));

router.post(
  "/account/reset/:token",
  authController.confirmPasswords,
  catchErrors(authController.update)
);

router.get("/map", storeController.mapPage);
router.get(
  "/hearts",
  authController.isLoggedIn,
  catchErrors(storeController.getHearts)
);
router.post(
  "/reviews/:id",
  authController.isLoggedIn,
  catchErrors(reviewController.addReview)
);

/* API END POINTS */

router.get("/api/search", catchErrors(storeController.searchStores));
router.get("/api/stores/near", catchErrors(storeController.mapStores));
router.post("/api/stores/:id/heart", catchErrors(storeController.heartStore));
module.exports = router;
