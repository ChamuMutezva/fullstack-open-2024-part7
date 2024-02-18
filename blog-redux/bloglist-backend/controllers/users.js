const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// 4.15: bloglist expansion, step3:
// Implement a way to create new users by doing an HTTP POST request to address api/users.
// Users have a username, password and name.

// 4.16*: bloglist expansion, step4
// Add a feature which adds the following restrictions to creating new users:
//  Both username and password must be given. Both username and password must be at least 3 characters long.
// The username must be unique.

// 4.17: bloglist expansion, step5

usersRouter.post("/api/users", async (request, response) => {
    const { username, name, password } = request.body;

    if (username.length < 3) {
        return response
            .status(400)
            .json({ error: "Username should be at least 3 characters long" });
    }

    if (password.length < 3) {
        return response
            .status(400)
            .json({ error: "Password should be at least 3 characters long" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
});

usersRouter.get("/api/users", async (request, response) => {
    const users = await User.find({}).populate("blogs", {
        title: 1,
        author: 1,
        url: 1,
        likes: 1,
    });
    response.json(users);
});

module.exports = usersRouter;
