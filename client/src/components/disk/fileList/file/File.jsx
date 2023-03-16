import React from "react";
import { useDispatch } from "react-redux";
import {
    pushToStack,
    setCurrentDirectory,
} from "../../../../store/file.reducer";
import { FileDropdown } from "./fileDropdown";

import folder from "../../../../assets/folder.png";
import jpg from "../../../../assets/jpg.png";
import pdf from "../../../../assets/pdf.png";
import png from "../../../../assets/png.png";
import txt from "../../../../assets/txt.png";
import xls from "../../../../assets/xls.png";
import zip from "../../../../assets/zip.png";
import noneType from "../../../../assets/file.png";

export const File = ({ reactId, file }) => {
    const { id, name, type, date, size } = file;
    const dispatch = useDispatch();

    const openDirectoryHandler = () => {
        if (type === "dir") {
            dispatch(setCurrentDirectory({ id, name }));
            dispatch(pushToStack({ id, name }));
        }
    };
    const imageFileType = (fileType) => {
        if (fileType === "dir") return folder;
        if (fileType === "jpg") return jpg;
        if (fileType === "pdf") return pdf;
        if (fileType === "png") return png;
        if (fileType === "txt") return txt;
        if (fileType === "xls") return xls;
        if (fileType === "zip") return zip;
        return noneType;
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
                className="col-9"
                onClick={() => {
                    openDirectoryHandler();
                }}
                role="button"
            >
                <div>
                    <img
                        className="me-2"
                        src={imageFileType(type)}
                        alt={type}
                    />
                    {name.length > 80 ? `${name.substr(0, 80)}...` : name}
                </div>
            </td>
            <td role="button">{type}</td>
            <td className="col-1">{date.slice(0, 10)}</td>
            <td className="col-1">{type !== "dir" ? `${size} байт` : ""}</td>
            <td>
                <FileDropdown file={file} />
            </td>
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
