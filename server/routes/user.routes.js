const Router = require("express");
const userController = require("../controller/user.controller");
const router = new Router();

router.post("/registration", userController.createUser);
router.get("/check", userController.getUser);
router.delete("/delete", userController.deleteUser);
router.post("/authorization", userController.authorizationUser);

module.exports = router;
