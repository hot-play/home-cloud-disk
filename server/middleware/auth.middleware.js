const jwt = require("jsonwebtoken");const config = require("../config/config.json");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: "Окончание времени действия сессии" });
        }
        const decode = jwt.verify(token, config.secretKey);
        req.user = decode;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Окончание времени действия сессии" });
    }
};
