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
        deleteBlog(state, action) {
            const id = action.payload.id;
            console.log(id);
            blogService.remove(id);
            return state.filter((blog) => blog.id === id);
        },
        appendBlog(state, action) {
            state.push(action.payload);
        },
        setBlogs(state, action) {
            return action.payload;
        },
    },
});

export const { setBlogs, appendBlog, updateLikes, createNewBlog, deleteBlog } =
    blogSlice.actions;
export default blogSlice.reducer;
