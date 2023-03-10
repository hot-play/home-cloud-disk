const dataBase = require("../config/database.options");
const config = require("../config/configurate.options");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fileService = require("../services/fileService.js");

class UserController {
    async createUser(req, res) {
        const { login, password } = req.body;
        if (login.length < 3 || login.length > 20) {
            res.json({ message: "Логин некорректен" });
        }
        if (password.length < 3 || password.length > 20) {
            res.json({ message: "Пароль некорректен" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const findUser = await dataBase.query(
            "select * from users where login = $1",
            [login.toString().toLowerCase()]
        );

        if (findUser.rows[0]?.login) {
            res.json({ message: "Логин занят" });
        } else {
            const user = await dataBase.query(
                "insert into users (login, password) values ($1, $2) returning *",
                [login.toString().toLowerCase(), hashPassword]
            );

            await fileService.createFolder({
                user_id: user.rows[0].id,
                name: "",
            });
            res.json({ message: "Аккаунт создан" });
        }
    }

    async getUser(req, res) {
        const { login } = req.body;
        const user = await dataBase.query(
            "select * from users where login = $1",
            [login.toString().toLowerCase()]
        );
        res.json(user.rows[0]);
    }

    async deleteUser(req, res) {
        const { login, password } = req.body;
        const user = await dataBase.query(
            "delete from users where login = $1",
            [login.toString().toLowerCase()]
        );
        res.json(user.rows[0]);
    }

    async authorizationUser(req, res) {
        const { login, password } = req.body;

        const user = await dataBase.query(
            "select * from users where login = $1",
            [login.toString().toLowerCase()]
        );
        if (user.rows[0]?.login) {
            const isValidPassword = bcrypt.compareSync(
                password,
                user.rows[0].password
            );
            if (isValidPassword) {
                const token = jwt.sign(
                    { id: user.rows[0].id },
                    config.SECRET_TOKEN_KEY,
                    { expiresIn: "1h" }
                );
                res.json({
                    token,
                    user: {
                        id: user.rows[0].id,
                        login: user.rows[0].login,
                        diskSpace: user.rows[0].diskspace,
                        usedSpace: user.rows[0].usedspace,
                    },
                });
            } else {
                res.json({ message: "Неверный пароль" });
            }
        } else {
            res.json({ message: "Пользователь не найден" });
        }
    }
    async tokenAuthorizationUser(req, res) {
        const { id } = req.user;
        const user = await dataBase.query("select * from users where id = $1", [
            id,
        ]);
        if (user?.rows[0]) {
            const token = jwt.sign(
                { id: user.rows[0].id },
                config.SECRET_TOKEN_KEY,
                {
                    expiresIn: "1h",
                }
            );
            res.json({
                token,
                user: {
                    id: user.rows[0].id,
                    login: user.rows[0].login,
                    diskSpace: user.rows[0].diskspace,
                    usedSpace: user.rows[0].usedspace,
                },
            });
        } else {
            res.json({ message: "Токен не проверен" });
        }
    }
}

module.exports = new UserController();
