import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoginContext from "./context/LoginContext";
import blogService from "./services/blogs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationMessage } from "./reducers/notificationReducer";
import { useSelector, useDispatch } from "react-redux";
import Notification from "./components/Notification";

function BlogPage() {
    const { blogId } = useParams();
    const [login] = useContext(LoginContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const info = useSelector((state) => state.notification);
    console.log(info);
    const result = useQuery({
        queryKey: ["blog"],
        queryFn: () => blogService.getSingleBlog(blogId),
    });

    const blog = result.data;

    const notifyWith = (message, type = "info") => {
        dispatch(notificationMessage(message));
        console.log(info);
        setTimeout(() => {
            dispatch(notificationMessage(null));
        }, 3000);
        console.log(info);
    };

    const updateBlogMutation = useMutation({
        mutationFn: blogService.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog"] });
        },
    });

    const deleteBlogMutation = useMutation({
        mutationFn: blogService.deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });

    const deleteBlog = (id) => {
       
        console.log(login?.username);

        if (login?.username) {
            if (
                confirm(
                    `Remove blog You're NOT gonna need it! by ${blog.author}`
                )
            ) {
                console.log(blog);
                try {
                    deleteBlogMutation.mutate(blog.id);
                    navigate(-1);
                } catch (error) {
                    notifyWith(error.message, "error");
                }
            } else {
                console.log("Deleting blog cancelled");
            }
        } else {
            notifyWith(
                `${blog.username} did not create this blog. A blog can only be deleted by the creator`,
                "error"
            );
        }
    };

    const updateLikes = (blog) => {
        try {
            updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
            notifyWith(
                `A like for the blog '${blog.title}' by '${blog.author}'`
            );
        } catch (error) {
            console.log(error);

            notifyWith(error, "error");
        }
    };

    return (
        <div>
            <h2>Blog</h2>
            {login?.username} logged in
            <Notification info={info} />
            <h3>{blog?.title}</h3>
            <a href={`${blog?.url}`}>{blog?.url}</a>
            <p>{blog?.likes} likes</p>
            <button id="like-btn" onClick={() => updateLikes(blog)}>
                Like
            </button>
            <button id="delete-btn" onClick={() => deleteBlog(blog.id)}>
                Delete
            </button>
        </div>
    );
}

export default BlogPage;
