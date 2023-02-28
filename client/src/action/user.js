import axios from "axios";export const registration = async (login, password) => {
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
        alert(error);
    }
};
