import { createStore } from "redux";

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "INFO_MESSAGE":
            return action.payload;
        case "ERROR_MESSAGE":
            return action.payload;
        default:
            return state;
    }
};

export const infoMessage = (message) => {
    return {
        type: "INFO_MESSAGE",
        payload: {
            message,
        },
    };
};

export const errorMessage = (message) => {
    return {
        type: "ERROR_MESSAGE",
        payload: {
            message,
        },
    };
};

export default notificationReducer;
