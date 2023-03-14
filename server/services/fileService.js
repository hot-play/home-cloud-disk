const fs = require("fs");
const config = require("../config/configurate.options");

class FileService {
    createFolder(options) {
        let filePath;
        if (options.path) {
            filePath = `${config.ROOT_STORAGE}\\${options.user_id}\\${options.path}`;
        } else {
            filePath = `${config.ROOT_STORAGE}\\${options.user_id}`;
        }

        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                    return resolve({ message: "Папка создан" });
                } else {
                    return reject({
                        message: "Папка или файл с таким именем уже существует",
                    });
                }
            } catch (error) {
                console.log(error);
                return reject({ message: "Ошибка создания" });
            }
        });
    }
    removeFile(file) {
        const path = this.getPath(file);
        if (file.type === "dir") {
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }
    getPath(file) {
        return `${config.ROOT_STORAGE}\\${file.user_id}\\${file.path}`;
    }
}

module.exports = new FileService();
