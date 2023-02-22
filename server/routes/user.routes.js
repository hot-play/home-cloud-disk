const Router = require("express");const userController = require("../controller/user.controller");
const router = new Router();

router.post("/user", userController.createUser);
router.get("/user", userController.getUser);
router.delete("/user", userController.deleteUser);
router.post("/user/auth", userController.authorizationUser);

module.exports = router;
