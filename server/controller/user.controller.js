const dataBase = require("../config/database.options");const config = require("../config/configurate.options");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fileService = require("../services/fileService");
const User = require("../models/User");

class UserController {
    async createUser(req, res) {
        const userData = new User();
        userData.login = req.body.login;
        userData.password = req.body.password;

        if (userData.login.length < 3 || userData.login.length > 20) {
            return res.json({ message: "Логин некорректен" });
        }
        if (userData.password.length < 3 || userData.password.length > 20) {
            return res.json({ message: "Пароль некорректен" });
        }
        userData.password = await bcrypt.hash(userData.password, 10);

        const findUser = await dataBase.query(
            "select * from users where login = $1",
            [userData.login]
        );

        if (findUser.rows[0]?.login) {
            return res.json({ message: "Логин занят" });
        }

        const user = await dataBase.query(
            "insert into users (login, password) values ($1, $2) returning *",
            [userData.login, userData.password]
        );
        userData.id = user.rows[0].id;

        await fileService.createFolder({
            user_id: userData.id,
            name: userData.id,
        });

        const token = jwt.sign({ id: userData.id }, config.SECRET_TOKEN_KEY, {
            expiresIn: config.SESSION_TIME,
        });

        return res.status(201).json({
            token,
            user: {
                id: user.rows[0].id,
                login: user.rows[0].login,
                diskSpace: user.rows[0].diskspace,
                usedSpace: user.rows[0].usedspace,
            },
            message: "Аккаунт создан",
        });
    }

    async deleteUser(req, res) {
        const userData = new User();
        userData.login = req.body.login;
        userData.password = req.body.password;

        await dataBase.query("delete from users where login = $1", [
            userData.login,
        ]);

        return res.json({ message: "Пользователь удален" });
    }

    async authorizationUser(req, res) {
        const userData = new User();
        userData.login = req.body.login;
        userData.password = req.body.password;

        const user = await dataBase.query(
            "select * from users where login = $1",
            [userData.login]
        );

        if (user.rows[0]?.login) {
            const isValidPassword = bcrypt.compareSync(
                userData.password,
                user.rows[0].password
            );
            if (isValidPassword) {
                const token = jwt.sign(
                    { id: user.rows[0].id },
                    config.SECRET_TOKEN_KEY,
                    { expiresIn: config.SESSION_TIME }
                );
                return res.json({
                    token,
                    user: {
                        id: user.rows[0].id,
                        login: user.rows[0].login,
                        diskSpace: user.rows[0].diskspace,
                        usedSpace: user.rows[0].usedspace,
                    },
                });
            } else {
                return res.json({ message: "Неверный пароль" });
            }
        } else {
            return res.json({ message: "Пользователь не найден" });
        }
    }
    async tokenAuthorizationUser(req, res) {
        const userData = new User();
        userData.id = req.user.id;

        const user = await dataBase.query("select * from users where id = $1", [
            userData.id,
        ]);

        if (user?.rows[0]) {
            const token = jwt.sign(
                { id: user.rows[0].id },
                config.SECRET_TOKEN_KEY,
                {
                    expiresIn: config.SESSION_TIME,
                }
            );
            return res.json({
                token,
                user: {
                    id: user.rows[0].id,
                    login: user.rows[0].login,
                    diskSpace: user.rows[0].diskspace,
                    usedSpace: user.rows[0].usedspace,
                },
            });
        } else {
            return res.json({ message: "Токен не проверен" });
        }
    }
}

module.exports = new UserController();
