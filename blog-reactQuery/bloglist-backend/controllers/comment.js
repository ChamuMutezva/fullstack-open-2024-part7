const commentRouter = require("express").Router();
const Comment = require("../models/comment"); // Import your Comment model

// Create a new comment for a blog
commentRouter.post("/api/blogs/:id/comments", async (req, res) => {
    try {
        const { content } = req.body;
        const blogId = req.params.id; // Get the blog ID from the URL

        // Create a new comment
        const comment = new Comment({ content, blog: blogId });
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

commentRouter.get("/api/blogs/:id/comments", async (request, response) => {
    const comments = await Comment.find({ blogs: request.params.id });
    response.json(comments);
  });

module.exports = commentRouter;
