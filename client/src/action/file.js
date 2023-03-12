import axios from "axios";
import { addFile, setFiles } from "../store/file.reducer";

export const getFiles = (directoryId) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `
                /api/files${directoryId ? "?parent_id=" + directoryId : ""}`,
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
};

export const createFile = (directoryId, fileName) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/api/files",
                {
                    name: fileName,
                    type: "dir",
                    parent_id: directoryId,
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
};

export const uploadFile = (file, directoryId) => {
    return async (dispatch) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            if (directoryId) {
                formData.append("parent_id", directoryId);
            }
            console.log(formData.files);
            const response = await axios.post("/api/files/upload", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                onUploadProgress: (progressEvent) => {
                    const totalLength = progressEvent.event.lengthComputable
                        ? progressEvent.event.total
                        : progressEvent.target.event.getResponseHeader(
                              "content-length"
                          ) ||
                          progressEvent.target.event.getResponseHeader(
                              "x-decompressed-content-length"
                          );
                    console.log("total", totalLength);
                    if (totalLength) {
                        let progress = Math.round(
                            (progressEvent.event.loaded * 100) / totalLength
                        );
                        console.log(progress);
                    }
                },
            });
            dispatch(addFile(response.data));
        } catch (error) {
            alert(error.response.data.message);
        }
    };
};
