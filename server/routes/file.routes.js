const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const fileController = require("../controller/file.controller");

router.post("", authMiddleware, fileController.createFolder);
router.get("", authMiddleware, fileController.getFiles);
router.post("/upload", authMiddleware, fileController.uploadFile);
router.get("/download", authMiddleware, fileController.downloadFile);
router.delete("/", authMiddleware, fileController.deleteFile);

module.exports = router;
