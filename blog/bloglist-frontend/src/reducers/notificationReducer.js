import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    message: null,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        notificationMessage(state, action) {
            return {
                ...state,
                message: action.payload
            }
        },
    },
});

export const { notificationMessage } = notificationSlice.actions;
export default notificationSlice.reducer;

/*
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
*/
