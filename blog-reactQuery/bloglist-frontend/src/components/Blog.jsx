import { useState } from "react";

const Blog = ({ blog, update, deleteBlog, user }) => {
    const [hide, setHide] = useState(true);
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    };

    const toggleDetails = () => setHide(!hide);

    return (
        <div style={blogStyle} className={`blog disclosure`}>
            <>
                <h3>{blog?.title}</h3>
                <p>{blog?.author}</p>
                <div
                    id="content"
                    className={`disclosure__content ${hide ? "hide" : ""}`}
                >
                    <p>{blog?.url}</p>
                    <div>
                        <p className="likes__value">
                            Likes{" "}
                            <span id="number-likes" className="span__value">
                                {blog?.likes}
                            </span>
                        </p>{" "}
                        <button id="like-btn" onClick={update}>
                            Like
                        </button>
                    </div>
                    {user === blog?.user?.username && (
                        <button id="delete-btn" onClick={deleteBlog}>
                            Delete
                        </button>
                    )}
                </div>
                <button
                    id="view-details-btn"
                    aria-expanded="false"
                    aria-controls="content"
                    onClick={toggleDetails}
                >
                    {hide ? "View" : "Hide"}
                </button>
            </>
        </div>
    );
};

export default Blog;
