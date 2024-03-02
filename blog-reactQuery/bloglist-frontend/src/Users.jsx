import React, { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import blogService from "./services/blogs";
import LoginContext from "./context/LoginContext";

function Users() {
    const [resultUsers, setResultUsers] = useState([]);
    const blogCountByUser = {};

    const result = useQuery({
        queryKey: ["blogs"],
        queryFn: blogService.getAll,
    });
    const blogs = result.data;
    const [login] = useContext(LoginContext);
    console.log(login);
    console.log(login?.username);

    if (blogs) {
        console.log(blogs);
        // Iterate through the blogs
        blogs.forEach((blog) => {
            const userId = blog.user.id;
            if (!blogCountByUser[userId]) {
                blogCountByUser[userId] = {
                    username: blog.user.username,
                    name: blog.user.name,
                    id: userId,
                    count: 1,
                };
            } else {
                blogCountByUser[userId].count++;
            }
        });
    }

    console.log(blogCountByUser);
    const res = Object.values(blogCountByUser);
    res.map((user) => console.log(user.count));
    console.log(res);
    // Convert the object values to an array
    // setResultUsers(Object.values(blogCountByUser));
    Object.keys(blogCountByUser).map((user) => console.log(user.id));

    return (
        <div>
            <div>
                <div>
                    <p>{login?.username} logged in</p>
                </div>
                <div className="flex">
                    <h2>Blogs</h2>
                    <Link to="/">Home</Link>
                </div>
                <table>
                    <caption>Users</caption>
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Blogs created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {res.map((user) => (
                            <tr key={user.id}>
                                <th>
                                    <Link to={`/users/${user.id}`}>
                                        {user.username}
                                    </Link>
                                </th>
                                <th>{user.count}</th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
