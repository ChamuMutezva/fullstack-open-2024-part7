const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// 4.16*: bloglist expansion, step4
// Add a feature which adds the following restrictions to creating new users:
//  Both username and password must be given. Both username and password must be at least 3 characters long.
// The username must be unique.

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
    },
    name: String,
    passwordHash: {
        type: String,
        minLength: 3,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    },
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);

module.exports = User;
