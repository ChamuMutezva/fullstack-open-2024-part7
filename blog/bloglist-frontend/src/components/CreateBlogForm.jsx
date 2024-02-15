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
            <form id="form" noValidate onSubmit={handleCreateBlog}>
                <div>
                    <label htmlFor="title">title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        name="title"
                        onChange={handleTitleChange}
                    />
                </div>
                <div>
                    <label htmlFor="author">author</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        name="author"
                        onChange={handleAuthorChange}
                    />
                </div>
                <div>
                    <label htmlFor="url">url</label>
                    <input
                        type="url"
                        id="url"
                        value={url}
                        name="url"
                        onChange={handleUrlChange}
                    />
                </div>
                <button id="createform-btn" type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreateBlogForm;
