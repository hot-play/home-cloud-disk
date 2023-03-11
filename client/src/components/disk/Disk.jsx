import React, { useEffect } from "react";import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../action/file";
import { popFromStack, setCurrentDirectory } from "../../store/file.reducer";
import { CreateFileModal } from "./CreateFileModal";
import { FileList } from "./fileList/FileList";
import { FileInput } from "./FileInput";

export const Disk = () => {
    const dispatch = useDispatch();
    const currentDirectory = useSelector(
        (state) => state.files.currentDirectory
    );
    const isBackButtonDisabled = true ? currentDirectory === null : false;
    const directoryStack = useSelector((state) => state.files.directoryStack);

    useEffect(() => {
        dispatch(getFiles(currentDirectory));
    }, [currentDirectory, dispatch]);

    const backClickHandler = () => {
        const backDirectoryId = directoryStack[directoryStack.length - 1];
        dispatch(popFromStack(backDirectoryId));
        dispatch(setCurrentDirectory(backDirectoryId));
    };

    return (
        <div className="m-5 bg-dark rounded">
            <div>
                <Button
                    onClick={() => backClickHandler()}
                    className="m-3 col-1"
                    disabled={isBackButtonDisabled}
                >
                    Назад
                </Button>
                <CreateFileModal />
                <FileInput />
            </div>
            <div>{}</div>
            <FileList />
        </div>
    );
};
