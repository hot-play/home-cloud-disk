const fs = require("fs");const config = require("../config/configurate.options");

class FileService {
    createFolder(options) {
        let filePath = "";
        if (options.path) {
            filePath = `${config.ROOT_STORAGE}\\${options.user_id}\\${options.path}`;
        } else {
            filePath = `${config.ROOT_STORAGE}\\${options.user_id}`;
        }

        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                    return resolve({ message: "Создано" });
                } else {
                    return reject({ message: "Файл уже существует" });
                }
            } catch (error) {
                return reject({ message: "Ошибка создания" });
            }
        });
    }
}

module.exports = new FileService();
