import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch } from "react-redux";
import { deleteFile, downloadFile } from "../../../../action/file";

export const FileDropdown = ({ file }) => {
    const { id, type } = file;
    const dispatch = useDispatch();
    const downloadClickHandler = (event) => {
        event.stopPropagation();
        downloadFile(file);
    };

    const deleteFileHandler = (event) => {
        event.stopPropagation();
        dispatch(deleteFile(id));
    };

    return (
        <Dropdown>
            <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
            ></Dropdown.Toggle>

            <Dropdown.Menu>
                {type !== "dir" && (
                    <Dropdown.Item
                        onClick={(event) => downloadClickHandler(event)}
                    >
                        Скачать
                    </Dropdown.Item>
                )}
                {/* <Dropdown.Item>Изменить название</Dropdown.Item> */}
                <Dropdown.Item onClick={(event) => deleteFileHandler(event)}>
                    Удалить
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};
