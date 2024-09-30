const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", userRoutes);

app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
