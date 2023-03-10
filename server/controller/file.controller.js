const fileService = require("../services/fileService");
const File = require("../models/File");
const dataBase = require("../config/database.options");
const fs = require("fs");
const config = require("../config/configurate.options");

class FileController {
    async createFolder(req, res) {
        try {
            const { name, type, parent_id } = req.body;
            const fileData = new File();
            fileData.name = name;
            fileData.type = type;
            fileData.parent_id = parent_id;
            fileData.user_id = req.user.id;
            const parentFile = await dataBase.query(
                "select * from files where (user_id = $1) and (id = $2)",
                [req.user.id, fileData.parent_id]
            );
            if (!parentFile.rows[0]) {
                fileData.path = name;
                fileData.parent_id = req.user.id;
                await fileService.createFolder(fileData);
            } else {
                fileData.path = `${parentFile.rows[0].path}\\${fileData.name}`;
                await fileService.createFolder(fileData);
            }
            const newFile = await dataBase.query(
                "insert into files (name, type, size, path, user_id, parent_id) values ($1, $2, $3, $4, $5, $6) returning *",
                [
                    fileData.name,
                    fileData.type,
                    fileData.size,
                    fileData.path,
                    fileData.user_id,
                    fileData.parent_id,
                ]
            );
            res.json({ message: "Файл создан" });
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
    async getFiles(req, res) {
        try {
            const parent_id = req.query.parent_id;
            if (parent_id) {
                const files = await dataBase.query(
                    "select * from files where (user_id = $1) and (parent_id = $2)",
                    [req.user.id, parent_id]
                );
                res.json(files.rows);
            } else {
                const files = await dataBase.query(
                    "select * from files where (user_id = $1) and (parent_id = $2)",
                    [req.user.id, req.user.id]
                );
                res.json(files.rows);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json("Ошибка файла");
        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.files.file;
            const parent_id = req.body.parent_id;
            const user_id = req.user?.id;

            const fileData = new File();
            fileData.name = file.name;
            fileData.parent_id = parent_id;
            fileData.user_id = user_id;
            fileData.size = file.size;

            const user = await dataBase.query(
                "select * from users where login = $1",
                [user_id.toString().toLowerCase()]
            );

            const parent = await dataBase.query(
                "select * from files where (user_id = $1) and (id = $2)",
                [req.user?.id, fileData.parent_id]
            );
            if (user.rows[0]?.usedSpace) {
                if (
                    user.rows[0].usedSpace + file.size >
                    user.rows[0]?.diskSpace
                ) {
                    res.status(400).json({
                        message: "Недостаточно места на диске",
                    });
                }
            } else {
                if (file.size > user.rows[0]?.diskSpace) {
                    res.status(400).json({
                        message: "Недостаточно места на диске",
                    });
                }
            }
            let usedSpace = 0;
            if (user.rows[0]?.usedSpace) {
                usedSpace = user.rows[0].usedSpace + file.size;
            } else {
                usedSpace = file.size;
            }
            let path;
            if (parent.rows[0]?.name) {
                path = `${config.ROOT_STORAGE}\\${user_id}\\${parent.rows[0].path}\\${file.name}`;
            } else {
                path = `${config.ROOT_STORAGE}\\${user_id}\\${file.name}`;
                fileData.parent_id = user_id;
            }

            if (fs.existsSync(path)) {
                console.log("Даааааааааааааааааааааааааааааааааааа");
                res.status(400).json({
                    message:
                        "Файл с таким именем и расположением уже существует",
                });
            }
            file.mv(path);

            const type = file.name.split(".").pop();
            fileData.type = type;
            const newFileData = await dataBase.query(
                "insert into files (name, type, size, path, user_id, parent_id) values ($1, $2, $3, $4, $5, $6) returning *",
                [
                    fileData.name,
                    fileData.type,
                    fileData.size,
                    fileData.path,
                    fileData.user_id,
                    fileData.parent_id,
                ]
            );
            await dataBase.query(
                "update users set usedSpace = $1 where id = $2;",
                [usedSpace, user_id]
            );

            res.json({ newFileData });
        } catch (error) {
            console.log(error);
            res.status(500).json("Ошибка загрузки файла");
        }
    }
}

module.exports = new FileController();
