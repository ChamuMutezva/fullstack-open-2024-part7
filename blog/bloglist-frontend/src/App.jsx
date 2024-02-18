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
} from "./reducers/blogsReducer";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
    //const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState("");
    // const [info, setInfo] = useState({ message: null });
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
        // blogService.getAll().then((blogs) => setBlogs(blogs));
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
        /*
        setInfo({
            message,
            type,
        });

        setTimeout(() => {
            setInfo({ message: null });
        }, 3000);*/
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
        //  setBlogs(blogs.concat(createdBlog));
        dispatch(createNewBlog(createdBlog));
        blogFormRef.current.toggleVisibility();
    };

    const like = (blog) => {
        console.log(blog.id);
        dispatch(updateLikes(blog.id));
        notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`);
    };

    const remove = async (blog) => {
        const ok = window.confirm(
            `Sure you want to remove '${blog.title}' by ${blog.author}`
        );
        if (ok) {
            await blogService.remove(blog.id);
            notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`);
            setBlogs(blogs.filter((b) => b.id !== blog.id));
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
