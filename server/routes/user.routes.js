const Router = require("express");const router = new Router();
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/registration", userController.createUser);
router.delete("/delete", authMiddleware, userController.deleteUser);
router.post("/authorization", userController.authorizationUser);
router.get("/token", authMiddleware, userController.tokenAuthorizationUser);

module.exports = router;
