const jwt = require("jsonwebtoken");const config = require("../config/configurate.options");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: "Неудалось автоматически авторизоваться" });
        }
        const decode = jwt.verify(token, config.SECRET_TOKEN_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Окончание времени действия сессии" });
    }
};
