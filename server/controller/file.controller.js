const fileService = require("../services/fileService");
const File = require("../models/File");
const User = require("../models/User");
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

            const parent = await dataBase.query(
                "select * from files where (user_id = $1) and (id = $2)",
                [fileData.user_id, fileData.parent_id]
            );

            if (!parent.rows[0]) {
                fileData.path = name;
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
            const user_id = req.user.id;

            const parent_id = req.query.parent_id
                ? req.query.parent_id
                : user_id;

            const files = await dataBase.query(
                "select * from files where (user_id = $1) and (parent_id = $2)",
                [user_id, parent_id]
            );

            return res.json(files.rows);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Ошибка файла" });
        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.files.file;

            const userData = new User();
            userData.id = req.user.id;

            const fileData = new File();
            fileData.name = file.name;
            fileData.parent_id = req.body.parent_id;
            fileData.user_id = userData.id;
            fileData.size = file.size;

            let usedSpace;

            if (file.size > config.MAX_FILE_SIZE) {
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

            if (parent.rows[0]?.name) {
                fileData.path = `${config.ROOT_STORAGE}\\${userData.id}\\${parent.rows[0].path}\\${file.name}`;
            } else {
                fileData.path = `${config.ROOT_STORAGE}\\${userData.id}\\${file.name}`;
                fileData.parent_id = userData.id;
            }

            if (fs.existsSync(fileData.path)) {
                return res.status(400).json({
                    message:
                        "Файл с таким именем и расположением уже существует",
                });
            }

            if (user.rows[0]?.usedSpace) {
                if (
                    user.rows[0].usedSpace + file.size >
                    user.rows[0]?.diskSpace
                ) {
                    return res.status(400).json({
                        message: "Недостаточно места на диске",
                    });
                } else {
                    usedSpace = user.rows[0].usedSpace + file.size;
                }
            } else {
                if (file.size > user.rows[0]?.diskSpace) {
                    return res.status(400).json({
                        message: "Недостаточно места на диске",
                    });
                } else {
                    usedSpace = file.size;
                }
            }

            file.mv(fileData.path);

            fileData.type = file.name.split(".").pop();
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
                [usedSpace, userData.id]
            );
            return res.json(newFile.rows[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Ошибка загрузки файла" });
        }
    }
}

module.exports = new FileController();
