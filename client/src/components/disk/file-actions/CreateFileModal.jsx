import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { createFile } from "../../../action/file";
import { getFiles } from "../../../action/file";

export const CreateFileModal = () => {
    const [fileName, setFileName] = useState("");
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const currentDirectory = useSelector(
        (state) => state.files.currentDirectory
    );

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const createFileHandler = () => {
        dispatch(createFile(currentDirectory.id, fileName));
        setShow(false);
    };

    useEffect(() => {
        dispatch(getFiles(currentDirectory.id));
    }, [currentDirectory, dispatch]);

    return (
        <>
            <Button className="m-3" onClick={() => handleShow()}>
                Создать папку
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Создание папка</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="Введите название файла..."
                                value={fileName}
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Отмена
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => createFileHandler()}
                    >
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
