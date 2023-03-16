const fileService = require("../services/fileService");
const File = require("../models/File");
const User = require("../models/User");
const dataBase = require("../config/database.options");
const fs = require("fs");
const config = require("../config/configurate.options");

class FileController {
    async createFolder(req, res) {
        try {
            const fileData = new File();
            fileData.name = req.body.name;
            fileData.type = req.body.type;
            fileData.parent_id = req.body.parent_id;
            fileData.user_id = req.user.id;

            const parent = await dataBase.query(
                "select * from files where (user_id = $1) and (id = $2)",
                [fileData.user_id, fileData.parent_id]
            );

            if (!parent.rows[0]) {
                fileData.path = fileData.name;
                fileData.parent_id = fileData.user_id;
                await fileService.createFolder(fileData);
            } else {
                fileData.path = `${parent.rows[0].path}\\${fileData.name}`;
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

            return res.json(newFile.rows[0]);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Ошибка создания папки" });
        }
    }

    async getFiles(req, res) {
        try {
            const fileData = new File();
            fileData.user_id = req.user.id;
            fileData.parent_id = req.query.parent_id
                ? req.query.parent_id
                : req.user.id;

            const files = await dataBase.query(
                "select * from files where (user_id = $1) and (parent_id = $2)",
                [fileData.user_id, fileData.parent_id]
            );

            return res.json(files.rows);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Ошибка файла" });
        }
    }

    async uploadFile(req, res) {
        try {
            const uploadingFile = req.files.file;

            const userData = new User();
            userData.id = req.user.id;

            const fileData = new File();
            fileData.name = req.body.name;
            fileData.parent_id = req.body.parent_id;
            fileData.user_id = req.user.id;
            fileData.size = uploadingFile.size;

            if (uploadingFile.size > config.MAX_FILE_SIZE) {
                return res.status(400).json({
                    message: "Файл слишком большой, максимальный размер: 1ГБ",
                });
            }

            const user = await dataBase.query(
                "select * from users where login = $1",
                [userData.id]
            );

            const parent = await dataBase.query(
                "select * from files where (user_id = $1) and (id = $2)",
                [userData.id, fileData.parent_id]
            );

            let absolutePath;
            if (parent.rows[0]?.name) {
                absolutePath = `${config.ROOT_STORAGE}\\${userData.id}\\${parent.rows[0].path}\\${fileData.name}`;
                fileData.path = `${parent.rows[0].path}\\${fileData.name}`;
            } else {
                absolutePath = `${config.ROOT_STORAGE}\\${userData.id}\\${fileData.name}`;
                fileData.path = `${fileData.name}`;
                fileData.parent_id = userData.id;
            }

            if (fs.existsSync(absolutePath)) {
                return res.status(400).json({
                    message:
                        "Файл с таким именем и расположением уже существует",
                });
            }

            if (user.rows[0]?.usedSpace) {
                if (
                    user.rows[0].usedSpace + uploadingFile.size >
                    user.rows[0]?.diskSpace
                ) {
                    return res.status(400).json({
                        message: "Недостаточно места на диске",
                    });
                } else {
                    userData.usedSpace =
                        user.rows[0].usedSpace + uploadingFile.size;
                }
            } else {
                if (uploadingFile.size > user.rows[0]?.diskSpace) {
                    return res.status(400).json({
                        message: "Недостаточно места на диске",
                    });
                } else {
                    userData.usedSpace = uploadingFile.size;
                }
            }
            uploadingFile.mv(absolutePath);

            fileData.type = uploadingFile.name.split(".").pop();

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

            await dataBase.query(
                "update users set usedSpace = $1 where id = $2;",
                [userData.usedSpace, userData.id]
            );

            return res.json(newFile.rows[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Ошибка загрузки файла" });
        }
    }

    async downloadFile(req, res) {
        try {
            const fileData = new File();
            fileData.user_id = req.user.id;
            fileData.file_id = req.query.id;

            const file = await dataBase.query(
                "select * from files where (user_id = $1) and (id = $2)",
                [fileData.user_id, fileData.file_id]
            );

            const path = `${config.ROOT_STORAGE}\\${file.rows[0].user_id}\\${file.rows[0].path}`;
            const fileName = path.split("\\").pop();

            if (fs.existsSync(path)) {
                return res.download(path, fileName);
            }

            return res.status(400).json({ message: "Файл не существует" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Ошибка скачивания файла" });
        }
    }

    async deleteFile(req, res) {
        try {
            const userData = new User();
            userData.id = req.user.id;

            const fileData = new File();
            fileData.user_id = req.user.id;
            fileData.file_id = req.query.id;

            const user = await dataBase.query(
                "select * from users where (id = $1)",
                [userData.id]
            );

            const file = await dataBase.query(
                "select * from files where (user_id = $1) and (id = $2)",
                [fileData.user_id, fileData.file_id]
            );

            if (!file.rows[0]) {
                return res.status(400).json({ message: "Файл не существует" });
            }
            userData.usedSpace = user.rows[0].usedSpace - file.rows[0].size;
            fileService.removeFile(file.rows[0]);

            await dataBase.query("delete from files where id = $1", [
                fileData.file_id,
            ]);

            await dataBase.query(
                "update users set usedSpace = $1 where id = $2;",
                [userData.usedSpace, userData.id]
            );

            return res.json({ message: "Файл удален" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Ошибка удаления файла" });
        }
    }
}

module.exports = new FileController();
