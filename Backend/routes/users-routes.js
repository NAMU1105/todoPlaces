const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// router.get("/", (req, res, next) => {
//   console.log("get");
//   res.json({ message: "it works" });
// });

router.get("/", usersControllers.getAllUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail(), // Test@test.com => test@test.com
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post(
  "/login",
  [check("email").not().isEmpty(), check("password").isLength({ min: 5 })],
  usersControllers.login
);

// router.post('/login', usersController.login);

module.exports = router;
