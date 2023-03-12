import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { getFiles, uploadFile } from "../../action/file";

export const FileInput = () => {
    const dispatch = useDispatch();

    const currentDirectory = useSelector(
        (state) => state.files.currentDirectory
    );

    useEffect(() => {
        dispatch(getFiles(currentDirectory.id));
    }, [currentDirectory, dispatch]);

    const style = {
        display: "none",
    };

    const fileUploadedHandler = (files) => {
        const file = files[0];
        console.log(file);
        dispatch(uploadFile(file, currentDirectory.id));
    };

    return (
        <label className="m-3">
            <div className="btn btn-primary" label="">
                Загрузить файл
            </div>
            <Form.Control
                multiple={false}
                style={style}
                type="file"
                onChange={(event) => {
                    fileUploadedHandler(event.target.files);
                }}
            />
        </label>
    );
};
