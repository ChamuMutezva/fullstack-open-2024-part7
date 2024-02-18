import { useState, useEffect, useRef } from "react";
import blogService from "../services/blogs";
import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
    name: "blogs",
    initialState: [],
    reducers: {
        createNewBlog(state, action) {
            console.log(action.payload);
            state.push(action.payload);
        },
        updateLikes(state, action) {
            console.log(action.payload);
            const id = action.payload;
            const blogToChange = state.find((blog) => blog.id === id);
            const changedBlog = {
                ...blogToChange,
                likes: blogToChange.likes + 1,
            };
            blogService.update(changedBlog);
            return state.map((blog) => (blog.id !== id ? blog : changedBlog));
        },
        appendBlog(state, action) {
            state.push(action.payload);
        },
        setBlogs(state, action) {
            return action.payload;
        },
    },
});

export const { setBlogs, appendBlog, updateLikes, createNewBlog } =
    blogSlice.actions;
export default blogSlice.reducer;
