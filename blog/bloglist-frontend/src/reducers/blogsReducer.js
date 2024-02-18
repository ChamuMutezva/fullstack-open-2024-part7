import { useState, useEffect, useRef } from "react";
import { createSlice } from "@reduxjs/toolkit";
/*
useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));

    console.log(info);
}, [blogs.length]);
*/
const initialState = [];

const blogSlice = createSlice({
    name: "blogs",
    initialState: [],
    reducers: {
        createNewBlog(state, action) {
            console.log(action.payload);
            state.push(action.payload);
        },
        appendBlog(state, action) {
            state.push(action.payload);
        },
        setBlogs(state, action) {
            return action.payload;
        },
    },
});

export const { setBlogs, appendBlog, createNewBlog } = blogSlice.actions;
export default blogSlice.reducer;
