const express = require("express");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./server/routes/user.routes.js");
const authRoutes = require("./server/routes/auth.routes.js");

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use(cookieParser());

//mongodb database setup
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Mongodb...");
  })
  .catch((err) => {
    console.log("Mongodb connection error: ", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
