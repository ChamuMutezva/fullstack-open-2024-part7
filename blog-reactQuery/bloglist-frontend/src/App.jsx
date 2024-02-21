import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Togglable";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [url, setUrl] = useState("");
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [infoMessage, setInfoMessage] = useState(null);
    const [targetBlog, setTargetBlog] = useState({});
    const blogFormRef = useRef();

    const logout = () => {
        console.log("log out");
        setUser(null);
        return window.localStorage.removeItem("loggedBlogAppUser");
    };

    const deleteBlog = (id) => {
        const blog = blogs.find((blog) => blog.id === id);

        console.log(user.username);
        console.log(blog.user.username);
        if (user.username === blog.user.username) {
            if (
                confirm(
                    `Remove blog You're NOT gonna need it! by ${blog.author}`
                )
            ) {
                console.log(user);
                console.log(blog);
                try {
                    blogService.deleteBlog(id).then((returnedBlog) => {
                        setBlogs(
                            blogs.filter(
                                (blog) => Number(blog.id) !== Number(id)
                            )
                        );
                    });
                } catch (error) {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        setErrorMessage(null);
                    }, 5000);
                }
            } else {
                console.log("Deleting blog cancelled");
            }
        } else {
            setErrorMessage(
                `${blog.user.username} did not create this blog. A blog can only be deleted by the creator`
            );
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    const updateLikes = (id) => {
        const blog = blogs.find((blog) => blog.id === id);
        const changedBlog = { ...blog, likes: blog.likes + 1 };
        setTargetBlog(changedBlog);
        console.log(changedBlog);
        blogService
            .update(id, changedBlog)
            .then((returnedBlog) => {
                setBlogs(prevState =>
                    prevState.map((blog) =>
                        Number(blog.id) !== Number(id) ? blog : returnedBlog
                    )
                );
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
            });
    };

    const handleCreateBlog = (event) => {
        event.preventDefault();
        blogFormRef.current.toggleVisibility();
        try {
            const blogObject = {
                author: author,
                title: title,
                url: url,
            };

            blogService.create(blogObject).then((returnedBlog) => {
                setBlogs(blogs.concat(returnedBlog));
                setAuthor("");
                setTitle("");
                setUrl("");
            });

            setInfoMessage(
                `A new blog ${blogObject.title} by ${blogObject.author}`
            );
            setTimeout(() => {
                setInfoMessage(null);
            }, 5000);
        } catch (error) {
            setErrorMessage(error);
            setTimeout(() => {
                setInfoMessage(null);
            }, 5000);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        console.log("logging in with", username, password);

        try {
            const user = await loginService.login({
                username,
                password,
            });

            window.localStorage.setItem(
                "loggedBlogAppUser",
                JSON.stringify(user)
            );

            blogService.setToken(user.token);
            setUser(user);
            setUsername("");
            setPassword("");
            console.log(user.token);
        } catch (exception) {
            setErrorMessage("Wrong username or password");
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    const createBlog = () => {
        return (
            <Togglable buttonLabel="Create blog" ref={blogFormRef}>
                <CreateBlogForm
                    handleCreateBlog={handleCreateBlog}
                    title={title}
                    author={author}
                    url={url}
                    handleTitleChange={({ target }) => setTitle(target.value)}
                    handleAuthorChange={({ target }) => setAuthor(target.value)}
                    handleUrlChange={({ target }) => setUrl(target.value)}
                />
            </Togglable>
        );
    };

    const loginForm = () => (
        <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
        />
    );

    useEffect(() => {
        blogService.getAll().then((blogs) => {
            blogs.sort((a, b) => b.likes - a.likes);
            return setBlogs(blogs);
        });
        console.log(blogs.length);
    }, [blogs.length]);

    useEffect(() => {
        if (targetBlog !== null) {
            setBlogs((prevState) =>
                prevState.map((blog) =>
                    blog.id === targetBlog.id ? targetBlog : blog
                )
            );
            setTargetBlog(null);
        }
    }, [targetBlog, targetBlog?.likes]);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
        if (loggedUserJSON === null) return;
        const decodedToken = jwtDecode(loggedUserJSON);
        const expirationTime = decodedToken.exp * 1000;
        console.log(decodedToken);
        console.log(expirationTime);
        console.log(Date.now());
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }

        console.log(expirationTime > Date.now());
        if (expirationTime < Date.now()) {
            setUser(null);
            window.localStorage.removeItem("loggedBlogAppUser");
        }
    }, []);

    return (
        <div>
            <Notification
                message={errorMessage || infoMessage}
                className={errorMessage ? "error" : "info"}
            />
            {!user && loginForm()}
            {user && (
                <div className="blogs">
                    <h2>blogs</h2>
                    <p>{user.username} logged in</p>
                    <button onClick={logout}>Log out</button>

                    {createBlog()}

                    <div className="blogs-list">
                        {blogs.map((blog) => (
                            <Blog
                                key={blog.id}
                                blog={blog}
                                user={user.username}
                                update={() => updateLikes(blog.id)}
                                deleteBlog={() => deleteBlog(blog.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
