import React from "react";

function CreateBlogForm({
    handleCreateBlog,
    handleTitleChange,
    handleAuthorChange,
    handleUrlChange,
    title,
    author,
    url,
}) {
    return (
        <div>
            <h3>Create new</h3>
            <form id="form" className="new-blog" noValidate onSubmit={handleCreateBlog}>
                <div className="container-inputs">
                    <label htmlFor="title">title</label>
                    <input
                        type="text"
                        id="title"
                        className="input"
                        value={title}
                        name="title"
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="container-inputs">
                    <label htmlFor="author">author</label>
                    <input
                        type="text"
                        id="author"
                        className="input"
                        value={author}
                        name="author"
                        onChange={handleAuthorChange}
                    />
                </div>
                <div className="container-inputs">
                    <label htmlFor="url">url</label>
                    <input
                        type="url"
                        id="url"
                        className="input"
                        value={url}
                        name="url"
                        onChange={handleUrlChange}
                    />
                </div>
                <button id="createform-btn" className="button" type="submit">
                    Create
                </button>
            </form>
        </div>
    );
}

export default CreateBlogForm;
