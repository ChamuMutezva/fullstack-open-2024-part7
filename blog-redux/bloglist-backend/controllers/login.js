/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

// 4.18: bloglist expansion, step6
// 4.19: bloglist expansion, step7


loginRouter.post("/api/login", async (request, response) => {
    const { username, password } = request.body;
    console.log(username);

    const user = await User.findOne({ username });
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);
    console.log(`user is ${user}`);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: "invalid username or password",
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: 60 * 60,
    });
    console.log(userForToken);
    response
        .status(200)
        .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
