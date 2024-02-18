require("dotenv").config();
const jwt = require("jsonwebtoken");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// 4.20*: bloglist expansion, step8
// Middleware function to authenticate user
const tokenExtractor = async (request, response, next) => {
    const authorization = request.get("authorization");
    let token = null;
    if (authorization?.toLowerCase().startsWith("bearer ")) {
        token = authorization.substring(7);
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: "Unauthorized access" });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
        return response.status(401).json({ error: "Unauthorized access" });
    }

    request.user = user;
    next();
};

blogRouter.get("/", (request, response) => {
    response.send(`<h1>Blog</h1>`);
});

blogRouter.get("/api/blogs", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
        id: 1,
    });

    response.json(blogs);
});

blogRouter.put("/api/blogs/:id", (request, response, next) => {
    const body = request.body;

    const blog = {
        likes: body.likes,
    };

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then((updatedBlog) => {
            response.json(updatedBlog);
        })
        .catch((error) => next(error));
});

blogRouter.delete(
    `/api/blogs/:id`,
    tokenExtractor,
    async (request, response) => {
        const blog = await Blog.findByIdAndRemove(request.params.id);
        if (!blog) {
            return response.status(404).json({ error: "Blog not found" });
        }

        if (blog.user.toString() !== request.user.id.toString()) {
            console.log(`blog.user: ${blog.user.toString()}`);
            console.log("---------------------")
            console.log(`request.user.id: ${request.user.id.toString()}`);
            return response.status(401).json({ error: "Unauthorized access" });
        }

        await Blog.findByIdAndRemove(request.params.id);

        response.status(204).end();
    }
);

blogRouter.post("/api/blogs", tokenExtractor, async (request, response) => {
    const { title, url, likes, author } = request.body;

    if (!title) {
        return response.status(400).json({ error: "Title is missing" });
    }

    if (!url) {
        return response.status(400).json({ error: "url is missing" });
    }
    const user = request.user;
    const blog = new Blog({
        title: title,
        author: author,
        url: url,
        likes: likes,
        user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
});

module.exports = blogRouter;
