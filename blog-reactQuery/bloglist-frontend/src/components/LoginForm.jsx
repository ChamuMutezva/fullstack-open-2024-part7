import React from "react";

const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password,
}) => (
    <form onSubmit={handleSubmit} className="login-form">
        <h2>Login to application</h2>
        <div className="container-inputs">
            <label htmlFor="username">username</label>
            <input
                type="text"
                id="username"
                className="input"
                value={username}
                name="Username"
                onChange={handleUsernameChange}
            />
        </div>
        <div className="container-inputs">
            <label htmlFor="password">password</label>
            <input
                type="password"
                id="password"
                className="input"
                value={password}
                name="Password"
                onChange={handlePasswordChange}
            />
        </div>
        <button id="login-btn" className="button" type="submit">
            login
        </button>
    </form>
);

export default LoginForm;
