const initialState = {
    message: null,
};
const notificationReducer = (state = initialState, action) => {
    if (action.type === "MESSAGE") {
        return action.payload;
    } else return state;
};

export const notificationMessage = (message) => {
    return {
        type: "MESSAGE",
        payload: {
            message,
        },
    };
};

export default notificationReducer;
