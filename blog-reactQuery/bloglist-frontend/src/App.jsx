import { useState, useEffect, useRef, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginContext from "./context/LoginContext";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Togglable";
import { notificationMessage } from "./reducers/notificationReducer";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [url, setUrl] = useState("");
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const blogFormRef = useRef();
    const queryClient = useQueryClient();
    const [user, loginDispatch] = useContext(LoginContext);
    const dispatch = useDispatch();
    const info = useSelector((state) => state.notification);

    const notifyWith = (message, type = "info") => {
        dispatch(notificationMessage(message, type));

        setTimeout(() => {
            dispatch(notificationMessage(null));
        }, 3000);
    };

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

    const logout = () => {
        console.log("log out");
        loginDispatch({
            type: "LOGOUT",
        });

        return window.localStorage.removeItem("loggedBlogAppUser");
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
            notifyWith(
                `A new blog ${blogObject.title} created by ${blogObject.author}`
            );
            setAuthor("");
            setTitle("");
            setUrl("");
        } catch (error) {
            notifyWith(error, "error");
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
            loginDispatch({
                type: "LOGIN",
                payload: user,
            });

            setUsername("");
            setPassword("");
        } catch (exception) {
            console.log(exception);
            notifyWith("Wrong username or password", "error");
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
        const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
        if (loggedUserJSON === null) return;
        const decodedToken = jwtDecode(loggedUserJSON);
        const expirationTime = decodedToken.exp * 1000;

        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            loginDispatch({
                type: "LOGIN",
                payload: user,
            });

            blogService.setToken(user.token);
        }

        if (expirationTime < Date.now()) {
            loginDispatch({
                type: "LOGOUT",
            });

            window.localStorage.removeItem("loggedBlogAppUser");
        }
    }, []);

    if (result.isLoading) {
        return <div>loading data...</div>;
    }

    const blogs = result.data;

    return (
        <div>
            <Notification info={info} />
            {!user && loginForm()}
            {user && (
                <div className="blogs">
                    <h2>blogs</h2>

                    <button onClick={logout}>Log out</button>
                    <Link to={"/users"}>Users</Link>

                    {createBlog()}

                    <div className="blogs-list">
                        {blogs.map((blog) => (
                            <Blog
                                key={blog.id}
                                blog={blog}
                                user={user.username}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
