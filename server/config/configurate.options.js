// В этом разделе находятся файлы конфигурации, c помощью которых можно поменять некоторые свойства.// SERVER_PORT: number , отвечает за PORT на котором будет запущен сервер
const SERVER_PORT = 5000;

// SERVER_PORT: number , отвечает за PORT на котором запущена база данных,
// по умолчанию = 5432
const POSTGRESQL_PORT = 5432;

// SECRET_TOKEN_KEY: string , секретная фраза используемая для создания токена (cocies)
const SECRET_TOKEN_KEY = "home_cloud_storage";

// ROOT_STORAGE: string , путь до хранилища загружаемых на сервер файлов
const ROOT_STORAGE = "D:\\home-cloud-disk\\server\\storage";

// MAX_FILE_SIZE: number , максимальный размер загружаемого файла
const MAX_FILE_SIZE = 1073741824;

// SESSION_TIME: string , время действия сессии
const SESSION_TIME = "30m";

module.exports = {
    SERVER_PORT,
    POSTGRESQL_PORT,
    SECRET_TOKEN_KEY,
    ROOT_STORAGE,
    MAX_FILE_SIZE,
    SESSION_TIME,
};
