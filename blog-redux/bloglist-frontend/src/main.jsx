import ReactDOM from "react-dom/client";
// import { createStore, combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";

import notificationReducer from "./reducers/notificationReducer";
import blogsReducer from "./reducers/blogsReducer";
/*
const reducer = combineReducers({
    notification: notificationReducer,
    blogs: blogsReducer,
}); */
const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogsReducer,
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);
