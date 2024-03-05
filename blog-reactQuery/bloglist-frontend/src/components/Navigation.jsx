import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LoginContext from "../context/LoginContext";

function Navigation() {
    const [user] = useContext(LoginContext);
    console.log(user?.username);
    // const dispatch = useDispatch();
    return (
        <div>
            {user && user.username ? (
                <div>
                    <Link to={"/"}>Blogs</Link>
                    <Link to={"/users"}>Users</Link>
                    <p>{user?.username} logged in</p>
                </div>
            ) : (
                <p>Logged out</p>
            )}
        </div>
    );
}

export default Navigation;
