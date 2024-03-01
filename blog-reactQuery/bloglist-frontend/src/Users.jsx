import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import blogService from "./services/blogs";
import LoginContext from "./context/LoginContext";

function Users() {
    const blogsPerAuthor = {};
    const blogUsers = {};
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

        blogs.forEach((blog) => {
            const author = blog.author;
            if (!blogsPerAuthor[author]) {
                blogsPerAuthor[author] = 1;
            } else {
                blogsPerAuthor[author]++;
            }
        });
      //  console.log(blogsPerAuthor);

        blogs.forEach((blog) => {
            const user = blog.user.username;
            console.log(user);
            if (!blogUsers[user]) {
                blogUsers[user] = 1
            } else {
                blogUsers[user]++
            }
        });

        console.log(blogUsers)
    }
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
                        {Object.keys(blogUsers).map((user) => (
                            <tr key={user}>
                                <th>
                                    <Link to="">{user}</Link>
                                </th>
                                <th>{blogUsers[user]}</th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
