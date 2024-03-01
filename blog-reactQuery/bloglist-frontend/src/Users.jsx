import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import blogService from "./services/blogs";
import LoginContext from "./context/LoginContext";

function Users() {
    const blogsPerAuthor = {};
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
        console.log(blogsPerAuthor);
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
                        {Object.keys(blogsPerAuthor).map((author) => (
                            <tr key={author}>
                                <th>{author}</th>
                                <th>{blogsPerAuthor[author]}</th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
