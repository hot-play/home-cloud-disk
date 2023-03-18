import React, { useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../action/file";
import { popFromStack, setCurrentDirectory } from "../../store/file.reducer";
import { CreateFileModal } from "./file-actions/CreateFileModal";
import { FileList } from "./fileList/FileList";
import { FileInput } from "./file-actions/FileInput";

export const Disk = () => {
    const dispatch = useDispatch();
    const currentDirectory = useSelector(
        (state) => state.files.currentDirectory
    );
    const isBackButtonDisabled = true ? currentDirectory.id === 0 : false;
    const directoryStack = useSelector((state) => state.files.directoryStack);

    useEffect(() => {
        dispatch(getFiles(currentDirectory.id));
    }, [currentDirectory, dispatch]);

    const backClickHandler = () => {
        dispatch(popFromStack(directoryStack[directoryStack.length - 1].id));
        dispatch(
            setCurrentDirectory(directoryStack[directoryStack.length - 2])
        );
    };

    return (
        <div>
            <div className="m-5 mt-0 bg-dark">
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
                    <div className="m-3 bg-white rounded d-flex">
                        {directoryStack.map((directory, index) => {
                            if (index === 0) {
                                return (
                                    <div key={index} className="m-2 ms-2 me-0">
                                        {directory.name}
                                    </div>
                                );
                            }
                            return (
                                <div key={index} className="m-2 ms-0 me-0">
                                    /{directory.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <FileList />
            </div>
        </div>
    );
};
