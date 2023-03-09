import React from "react";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import {
    pushToStack,
    setCurrentDirectory,
} from "../../../../store/file.reducer";
import folderLogo from "./folder.png";

export const File = ({ file }) => {
    const { id, name, type } = file;
    const dispatch = useDispatch();

    const currentDirectory = useSelector(
        (state) => state.files.currentDirectory
    );

    const openDirectoryHandler = () => {
        if (type === "dir") {
            dispatch(pushToStack(currentDirectory));
            dispatch(setCurrentDirectory(id));
        }
    };
    return (
        <Card
            className="m-2"
            onClick={() => {
                openDirectoryHandler();
            }}
        >
            <img src={folderLogo} className="img-fluid p-5" alt="img-fluid" />
            <p className="card-title text-center">{name}</p>
        </Card>
    );
};
