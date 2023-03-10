import React from "react";import { useSelector } from "react-redux";
import { File } from "./file/File";

export const FileList = () => {
    const files = useSelector((state) => state.files.files);

    return (
        <div className="container-fluid d-inline-flex flex-wrap p-0 m-2">
            {files.map((file) => {
                return <File key={file.id} file={file} />;
            })}
        </div>
    );
};
