const express = require("express");
const router = express.Router();
const {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controllers");
const {
  requireSignin,
  hasAuthorization,
} = require("../controllers/auth.controllers");

router.route("/").get(listUsers).post(createUser);

router
  .route("/:id")
  .get(requireSignin, getUser)
  .put(requireSignin, hasAuthorization, updateUser)
  .delete(requireSignin, hasAuthorization, deleteUser);

module.exports = router;
