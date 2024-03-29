/* eslint-disable no-undef */
require("dotenv").config();

const PORT = process.env.PORT;
// const MONGO_URI = process.env.MONGO_URI

const MONGO_URI =
    process.env.NODE_ENV==="test"
        ? process.env.TEST_MONGO_URI
        : process.env.MONGO_URI;

console.log(MONGO_URI);

module.exports = {
    MONGO_URI,
    PORT,
};
