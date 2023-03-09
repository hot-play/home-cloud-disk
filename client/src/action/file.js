import axios from "axios";
import { addFile, setFiles } from "../store/file.reducer";

export function getFiles(fileId) {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/files${
                    fileId ? "?parent_id=" + fileId : ""
                }`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            dispatch(setFiles(response.data));
        } catch (error) {
            alert(error.response.data.message);
        }
    };
}

export function createFile(fileId, fileName) {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/files",
                {
                    name: fileName,
                    type: "dir",
                    parent_id: fileId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            dispatch(addFile(response.data));
        } catch (error) {
            alert(error.response.data.message);
        }
    };
}
