import axios from "axios";
import { setUser } from "../store/user.reducer";

export const registration = async (login, password) => {
    const content = {
        login: login,
        password: password,
    };
    try {
        const response = await axios.post(
            "http://localhost:5000/api/auth/registration",
            content
        );
        alert(response.data.message);
    } catch (error) {
        alert(error.response.data.message);
    }
};

export const authorization = (login, password) => {
    return async (dispatch) => {
        const content = {
            login: login,
            password: password,
        };
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/authorization",
                content
            );
            dispatch(setUser(response.data.user));
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            alert(error.response.data.message);
        }
    };
};

export const tokenAuthorization = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/auth/token",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            dispatch(setUser(response.data.user));
            localStorage.setItem("token", response.data.token);
        } catch (error) {}
    };
};
