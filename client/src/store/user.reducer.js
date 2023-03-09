const defaultState = { currentUser: {}, isAuth: false };const SET_USER = "SET_USER";
const LOGOUT_USER = "LOGOUT_USER";

export const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload.user,
                isAuth: true,
            };
        case LOGOUT_USER:
            localStorage.removeItem("token");
            return {
                ...state,
                currentUser: {},
                isAuth: false,
            };
        default:
            return state;
    }
};

export const setUser = (user) => ({ type: SET_USER, payload: user });
export const logoutUser = () => ({ type: LOGOUT_USER });
