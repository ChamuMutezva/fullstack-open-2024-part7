import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import storageService from "./services/storage";
import LoginForm from "./components/LoginForm";
import NewBlog from "./components/NewBlog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { notificationMessage } from "./reducers/notificationReducer";
import {
    appendBlog,
    setBlogs,
    createNewBlog,
    updateLikes,
    deleteBlog,
} from "./reducers/blogsReducer";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
    const [user, setUser] = useState("");
    const dispatch = useDispatch();

    const info = useSelector((state) => state.notification);
    const blogs = useSelector((state) => state.blogs);
    console.log(blogs);
    const blogFormRef = useRef();

    useEffect(() => {
        const user = storageService.loadUser();
        setUser(user);
    }, []);

    useEffect(() => {
        blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
        console.log(info);
        console.log(blogs.length);
    }, [blogs.length]);

    const notifyWith = (message, type = "info") => {
        dispatch(notificationMessage(message));
        console.log(info);
        setTimeout(() => {
            dispatch(notificationMessage(null));
        }, 3000);
        console.log(info);
    };

    const login = async (username, password) => {
        try {
            const user = await loginService.login({ username, password });
            setUser(user);
            storageService.saveUser(user);
            notifyWith("welcome!");
        } catch (e) {
            notifyWith("wrong username or password", "error");
        }
    };

    const logout = async () => {
        setUser(null);
        storageService.removeUser();
        notifyWith("logged out");
    };

    const createBlog = async (newBlog) => {
        const createdBlog = await blogService.create(newBlog);
        notifyWith(
            `A new blog '${newBlog.title}' by '${newBlog.author}' added`
        );
        dispatch(createNewBlog(createdBlog));
        blogFormRef.current.toggleVisibility();
    };

    const like = (blog) => {
        console.log(blog.id);
        dispatch(updateLikes(blog.id));
        notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`);
    };

    const remove = (blog) => {
        console.log(blog);
        const ok = window.confirm(
            `Sure you want to remove '${blog.title}' by ${blog.author}`
        );
        if (ok) {
            dispatch(deleteBlog(blog));
            notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`);
        }
    };

    if (!user) {
        return (
            <div>
                <h2>log in to application</h2>
                <Notification info={info} />
                <LoginForm login={login} />
            </div>
        );
    }

    const byLikes = (b1, b2) => b2.likes - b1.likes;

    return (
        <div>
            <h2>blogs</h2>
            <Notification info={info} />
            <div>
                {user.name} logged in
                <button onClick={logout}>logout</button>
            </div>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <NewBlog createBlog={createBlog} />
            </Togglable>
            <div>
                {blogs.map((blog) => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        like={() => like(blog)}
                        canRemove={user && blog.user.username === user.username}
                        remove={() => remove(blog)}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
