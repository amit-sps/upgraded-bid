require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { verifyToken } = require("./middlewares/authmiddleware");
const cors = require("cors");
const YAML = require("yamljs");

const swaggerUi = require("swagger-ui-express");
const swaggerJsDocs = YAML.load("./documentation/swagger.yaml");

const authRouters = require("./routes/auth");
const bid = require("./routes/Bid");
const teamRouters = require("./routes/team");
const resourceRouters = require("./routes/resources");
const userRouters = require("./routes/users");


const { CONNECTION_STRING } = require("./config/db.config");

mongoose.connect(
  CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to Mongoose.....");
    }
  }
);
app.use(cors());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/auth", authRouters);
app.use("/bids", verifyToken, bid);
app.use("/team", verifyToken, teamRouters);
app.use("/resource", verifyToken, resourceRouters);
app.use("/users", verifyToken, userRouters);

module.exports = app;
