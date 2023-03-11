const config = require("../config/configurate.options");
class User {
    id = 0;
    login = "default";
    password = "default";
    diskSpace = config.diskSpace;
    usedSpace = 0;
}

module.exports = User;
