const initialState = [];

const blogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "a":
            return state;
        case "b":
            return "state";
        default:
            return state;
    }
};

export default blogsReducer;
