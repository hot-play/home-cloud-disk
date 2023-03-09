const fs = require("fs");
const config = require("../config/config.json");

class FileService {
    createFolder(options) {
        let filePath = "";
        if (options.path) {
            filePath = `${config.rootStorage}\\${options.user_id}\\${options.path}`;
        } else {
            filePath = `${config.rootStorage}\\${options.user_id}`;
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
