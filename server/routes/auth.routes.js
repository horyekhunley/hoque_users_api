const express = require("express");
const router = express.Router();
const {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
} = require("../controllers/auth.controllers");

router.route('/signin').post(signin);
router.route('/signout').get(signout);

module.exports = router;