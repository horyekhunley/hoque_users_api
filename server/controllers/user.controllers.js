const { User, validateUser } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const createUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();
  res.send(savedUser);
};
const listUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.send(users);
};
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
};
const updateUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  res.send(user);
};
const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("User deleted.");
};



module.exports = {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
};
