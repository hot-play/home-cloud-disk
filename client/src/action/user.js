import axios from "axios";
import { setUser } from "../store/user.reducer";
import { showDefaultToast } from "../components/toast/default-toast";
import { showErrorToast } from "../components/toast/error-toast";

export const registration = (login, password) => {
    return async (dispatch) => {
        const content = {
            login: login,
            password: password,
        };
        try {
            const response = await axios.post(
                "/api/auth/registration",
                content
            );
            if (response.status === 201) {
                dispatch(setUser(response.data.user));
                localStorage.setItem("token", response.data.token);
                showDefaultToast(response.data.message);
            }
            showDefaultToast(response.data.message);
        } catch (error) {
            showErrorToast(error.response.data.message);
        }
    };
};

export const authorization = (login, password) => {
    return async (dispatch) => {
        const content = {
            login: login,
            password: password,
        };
        try {
            const response = await axios.post(
                "/api/auth/authorization",
                content
            );
            dispatch(setUser(response.data.user));
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            showErrorToast(error.response.data.message);
        }
    };
};

export const tokenAuthorization = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("/api/auth/token", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(setUser(response.data.user));
            localStorage.setItem("token", response.data.token);
        } catch (error) {}
    };
};
