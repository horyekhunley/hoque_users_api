const { User, validateUser } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const expressJwt = require("express-jwt");
require("dotenv").config();

const signin = async (req, res) => {
  //first validate input
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    //check if user exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "User not found" });

    //check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });

    //send token and user to client
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(401).send("Something went wrong.");
  }
};
const signout = async (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "Signout success!" });
};
const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
  userProperty: "auth",
});
const hasAuthorization = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  //   const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  //   if (!authorized) {
  //     return res.status("403").json({
  //       error: "User is not authorized",
  //     });
  //   }
  //   next();
};
module.exports = {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
};
