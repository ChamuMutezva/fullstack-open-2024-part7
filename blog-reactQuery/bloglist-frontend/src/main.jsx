import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginContextProvider } from "./context/LoginContext";
import App from "./App";
import Users from "./Users";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <LoginContextProvider>
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/users" element={<Users />} />
                    <Route path="/" element={<App />} />
                </Routes>
            </Router>
        </QueryClientProvider>
    </LoginContextProvider>
);
