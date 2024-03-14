import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LoginContext from "../context/LoginContext";

function Navigation() {
    const [user, loginDispatch] = useContext(LoginContext);
    const navigate = useNavigate();

    console.log(user?.username);
    // const dispatch = useDispatch();
    const logout = () => {
        console.log("log out");
        loginDispatch({
            type: "LOGOUT",
        });
        navigate("/");
        return window.localStorage.removeItem("loggedBlogAppUser");
    };
    return (
        <div className="nav-container">
            {user && user.username ? (
                <div>
                    <nav className="navs">
                        <Link to={"/"}>Blogs</Link>
                        <Link to={"/users"}>Users</Link>
                        <button onClick={logout} className="button">
                            Log out
                        </button>
                    </nav>
                    <p>{user?.username} logged in</p>
                </div>
            ) : (
                <p className="logged-out">Logged out</p>
            )}
        </div>
    );
}

export default Navigation;
