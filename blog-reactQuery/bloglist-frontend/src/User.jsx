import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "./services/users";

function User() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        userService.getSingleUser(id).then((user) => setUserData(user));
    }, []);
    console.log(userData);
    console.log(id);
    return (
        <div>
            <h2>{userData?.name}</h2>
            <h3>Added blogs</h3>
            <button onClick={() => navigate(-1)}>Back</button>
            {userData &&
                userData?.blogs?.map((blog) => (
                    <div key={blog.id}>
                        <p>{blog.title}</p>
                    </div>
                ))}
        </div>
    );
}

export default User;
