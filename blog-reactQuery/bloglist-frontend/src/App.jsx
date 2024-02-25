import { useState, useEffect, useRef, useReducer } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Togglable";

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "INFO":
            return {
                ...state,
                message: action.payload.message,
                type: action.payload.type,
            };
        case "ERROR":
            return {
                ...state,
                message: action.payload.message,
                type: action.payload.type,
            };
        case "RESET":
            return action.payload;
        default:
            return state;
    }
};

const App = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [url, setUrl] = useState("");
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");

    const [targetBlog, setTargetBlog] = useState({});
    const blogFormRef = useRef();
    const queryClient = useQueryClient();
    const [notification, notificationDispatch] = useReducer(
        notificationReducer,
        { message: "", type: "reset" }
    );

    const result = useQuery({
        queryKey: ["blogs"],
        queryFn: blogService.getAll,
    });

    const newBlogMutation = useMutation({
        mutationFn: blogService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });

    const updateBlogMutation = useMutation({
        mutationFn: blogService.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });

    const deleteBlogMutation = useMutation({
        mutationFn: blogService.deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });

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
                    deleteBlogMutation.mutate(id);
                    /*
                    blogService.deleteBlog(id).then((returnedBlog) => {
                        setBlogs(
                            blogs.filter(
                                (blog) => Number(blog.id) !== Number(id)
                            )
                        );
                    });
                    */
                } catch (error) {
                    notificationDispatch({
                        type: "ERROR",
                        payload: {
                            message: error.message,
                            type: "error",
                        },
                    });
                    setTimeout(() => {
                        console.log(notification.message);
                        notificationDispatch({
                            type: "RESET",
                            payload: {
                                message: "",
                                type: "reset",
                            },
                        });
                    }, 5000);
                }
            } else {
                console.log("Deleting blog cancelled");
            }
        } else {
            notificationDispatch({
                type: "ERROR",
                payload: {
                    message: `${blog.user.username} did not create this blog. A blog can only be deleted by the creator`,
                    type: "error",
                },
            });
            setTimeout(() => {
                console.log(notification.message);
                notificationDispatch({
                    type: "RESET",
                    payload: {
                        message: "",
                        type: "reset",
                    },
                });
            }, 5000);
        }
    };

    const updateLikes = (blog) => {
        //const blog = blogs.find((blog) => blog.id === id);
        //const changedBlog = { ...blog, likes: blog.likes + 1 };
        // setTargetBlog(changedBlog);
        console.log(blog);
        // console.log(changedBlog);
        try {
            updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
        } catch (error) {
            notificationDispatch({
                type: "ERROR",
                payload: {
                    message: error.message,
                    type: "error",
                },
            });
            setTimeout(() => {
                console.log(notification.message);
                notificationDispatch({
                    type: "RESET",
                    payload: {
                        message: "",
                        type: "reset",
                    },
                });
            }, 5000);
        }

        console.log(blogs);
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

            newBlogMutation.mutate(blogObject);
            /*
            blogService.create(blogObject).then((returnedBlog) => {
                setBlogs(blogs.concat(returnedBlog));
                setAuthor("");
                setTitle("");
                setUrl("");
            });
            */
            notificationDispatch({
                type: "INFO",
                payload: {
                    message: `A new blog ${blogObject.title} by ${blogObject.author}`,
                    type: "info",
                },
            });
            setTimeout(() => {
                console.log(notification.message);
                notificationDispatch({
                    type: "RESET",
                    payload: {
                        message: "",
                        type: "reset",
                    },
                });
            }, 5000);
        } catch (error) {
            notificationDispatch({
                type: "ERROR",
                payload: {
                    message: error,
                    type: "error",
                },
            });
            setTimeout(() => {
                console.log(notification.message);
                notificationDispatch({
                    type: "RESET",
                    payload: {
                        message: "",
                        type: "reset",
                    },
                });
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
            {
                /*
            notificationDispatch({
                type: "INFO",
                payload: {
                    message: `You are loggin as ${username}`,
                    type: "info",
                },
            });
            setTimeout(() => {
                console.log(notification.message);               
                notificationDispatch({
                    type: "RESET",
                    payload: {
                        message: "",
                        type: "reset",
                    },
                });
            }, 5000);
        */
            }
        } catch (exception) {
            // setErrorMessage("Wrong username or password");
            notificationDispatch({
                type: "ERROR",
                payload: {
                    message: "Wrong username or password",
                    type: "error",
                },
            });
            console.log(notification.message);
            setTimeout(() => {
                console.log(notification.message);
                // setErrorMessage(null);
                notificationDispatch({
                    type: "RESET",
                    payload: {
                        message: "",
                        type: "reset",
                    },
                });
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
    /*
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
*/
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
        if (loggedUserJSON === null) return;
        const decodedToken = jwtDecode(loggedUserJSON);
        const expirationTime = decodedToken.exp * 1000;

        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }

        if (expirationTime < Date.now()) {
            setUser(null);
            window.localStorage.removeItem("loggedBlogAppUser");
        }
    }, []);

    if (result.isLoading) {
        return <div>loading data...</div>;
    }

    const blogs = result.data;

    return (
        <div>
            {notification.type !== "reset" && (
                <Notification
                    message={notification.message}
                    className={notification.type === "error" ? "error" : "info"}
                />
            )}
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
                                update={() => updateLikes(blog)}
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
