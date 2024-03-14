const commentRouter = require("express").Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment"); // Import your Comment model

// Create a new comment for a blog
commentRouter.post("/api/blogs/:id/comments", async (req, res) => {
    try {
        const { content } = req.body;
        const blogId = req.params.id; // Get the blog ID from the URL
        const blog = await Blog.findById(blogId);
        console.log(blog);
        // Create a new comment
        const comment = new Comment({ content, blog: blogId });
        await comment.save();
     //   blog.comment = blog.comment.concat(blogId);
        
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

commentRouter.get("/api/blogs/:id/comments", async (request, response) => {
    console.log(request.params.id);
    const comments = await Comment.find({ blogs: request.params.id });
    console.log(comments);
    response.json(comments);
});

module.exports = commentRouter;
