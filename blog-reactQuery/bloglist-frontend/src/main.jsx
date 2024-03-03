import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { LoginContextProvider } from "./context/LoginContext";
import notificationReducer from "./reducers/notificationReducer";
import App from "./App";
import Users from "./Users";
import User from "./User";
import BlogPage from "./BlogPage";
import "./index.css";

const queryClient = new QueryClient();

const store = configureStore({
    reducer: {
        notification: notificationReducer,
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <LoginContextProvider>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/:id" element={<User />} />
                        <Route path="/blogs/:blogId" element={<BlogPage />} />
                        <Route path="/" element={<App />} />
                    </Routes>
                </Router>
            </QueryClientProvider>
        </LoginContextProvider>
    </Provider>
);
