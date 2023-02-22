const dataBase = require("../config/bataBase-config");const bcrypt = require("bcrypt");
class UserController {
    async createUser(req, res) {
        const { login, password } = req.body;
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
            res.json(user.rows[0]);
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

        const findUser = await dataBase.query(
            "select * from users where login = $1",
            [login.toString().toLowerCase()]
        );
        const isValidPassword = bcrypt.compareSync(
            password,
            findUser.rows[0].password
        );
        if (isValidPassword) {
            res.json({ result: true });
        } else {
            res.json({ result: false });
        }
    }
}

module.exports = new UserController();
