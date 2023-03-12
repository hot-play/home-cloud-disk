import React from "react";
import { useDispatch } from "react-redux";
import {
    pushToStack,
    setCurrentDirectory,
} from "../../../../store/file.reducer";
import { FileDropdown } from "./fileDropdown";

export const File = ({ reactId, file }) => {
    const { id, name, type, date, size } = file;
    const dispatch = useDispatch();

    const openDirectoryHandler = () => {
        if (type === "dir") {
            dispatch(setCurrentDirectory({ id, name }));
            dispatch(pushToStack({ id, name }));
        }
    };

    return (
        <tr>
            <td
                className=""
                onClick={() => {
                    openDirectoryHandler();
                }}
                role="button"
            >
                {reactId}
            </td>
            <td
                className=""
                onClick={() => {
                    openDirectoryHandler();
                }}
                role="button"
            >
                {type}
            </td>
            <td
                className="col-9"
                onClick={() => {
                    openDirectoryHandler();
                }}
                role="button"
            >
                {name.length > 80 ? `${name.substr(0, 80)}...` : name}
            </td>
            <td className="">
                <FileDropdown fileId={id} />
            </td>
            <td className="col-1">{date.slice(0, 10)}</td>
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
