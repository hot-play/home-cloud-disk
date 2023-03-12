import Dropdown from "react-bootstrap/Dropdown";
export const FileDropdown = ({ fileId }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
            ></Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Свойства</Dropdown.Item>
                <Dropdown.Item href="#/action-2">
                    Изменить название
                </Dropdown.Item>
                <Dropdown.Item href="#/action-3">Удалить</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};
