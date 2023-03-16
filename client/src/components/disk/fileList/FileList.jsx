import React from "react";import { useSelector } from "react-redux";
import { File } from "./file/File";
import Table from "react-bootstrap/Table";
export const FileList = () => {
    const files = useSelector((state) => state.files.files);

    return (
        <Table striped bordered hover bgcolor="white">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Название</th>
                    <th>Тип</th>
                    <th>Дата создания</th>
                    <th>Размер</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {files.map((file, index) => {
                    return <File key={index} reactId={index} file={file} />;
                })}
            </tbody>
        </Table>
    );
};
