import React from "react";import { useDispatch, useSelector } from "react-redux";
import {
    pushToStack,
    setCurrentDirectory,
} from "../../../../store/file.reducer";

export const File = ({ reactId, file }) => {
    const { id, name, type, date, size } = file;
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
        <tr
            onClick={() => {
                openDirectoryHandler();
            }}
            role="button"
        >
            <td className="col-1">{reactId}</td>
            <td className="col-1">{type}</td>
            <td className="col-7">
                {name.length > 80 ? `${name.substr(0, 80)}...` : name}
            </td>
            <td className="col-2">{date.slice(0, 10)}</td>
            <td className="col-1">{size > 0 ? `${size} байт` : ""}</td>
        </tr>
        // <Card
        //     className="m-2"
        //     onClick={() => {
        //         openDirectoryHandler();
        //     }}
        // >
        //     <img src={folderLogo} className="img-fluid p-5" alt="img-fluid" />
        //     <p className="card-title text-center">{fileName}</p>
        // </Card>
    );
};
