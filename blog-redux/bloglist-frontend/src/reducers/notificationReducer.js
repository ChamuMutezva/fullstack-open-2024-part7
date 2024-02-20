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