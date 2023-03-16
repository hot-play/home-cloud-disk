import axios from "axios";import { addFile, setFiles, removeFile } from "../store/file.reducer";
import { showErrorToast } from "../components/toast/error-toast";

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
            showErrorToast(error.response.data.message);
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
            showErrorToast(error.response.data.message);
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
            formData.append("name", file.name);
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
            showErrorToast(error.response.data.message);
        }
    };
};

export const deleteFile = (fileId) => {
    return async (dispatch) => {
        try {
            console.log(fileId);
            const response = await axios.delete(`/api/files?id=${fileId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(removeFile(fileId));
            alert(response.data.message);
        } catch (error) {
            showErrorToast(error.response.data.message);
        }
    };
};

export const downloadFile = async (file) => {
    const response = await fetch(`/api/files/download?id=${file.id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (response.status === 200) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
