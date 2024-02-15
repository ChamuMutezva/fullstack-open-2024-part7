const config = require("./utils/config");
const middleware = require("./utils/middleware");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const blogRouter = require("./controllers/blog");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const testingRouter = require("./controllers/testing");

mongoose.set("strictQuery", false);

if (process.env.NODE_ENV.trim("") === "test") {
    console.log(process.env.NODE_ENV);
    app.use("/api/testing", testingRouter);
}

mongoose
    .connect(config.MONGO_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.json());
app.use(blogRouter);
app.use(usersRouter);
app.use(loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
