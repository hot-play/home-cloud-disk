const fileService = require("../services/fileService");
const File = require("../models/File");
const dataBase = require("../config/bataBase-config");

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
}

module.exports = new FileController();
