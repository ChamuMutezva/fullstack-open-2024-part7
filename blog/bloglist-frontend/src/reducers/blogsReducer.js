import { useState, useEffect, useRef } from "react";
/*
useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));

    console.log(info);
}, [blogs.length]);
*/
const initialState = [];

const blogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "a":
            return state;
        case "b":
            return "state";
        default:
            return state;
    }
};

export default blogsReducer;
