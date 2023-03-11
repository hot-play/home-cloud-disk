const express = require("express");const userRouter = require("./routes/user.routes");
const fileRouter = require("./routes/file.routes");
const corsMiddleware = require("./middleware/cors.middleware");
const fileUpload = require("express-fileupload");
const config = require("./config/configurate.options");

const PORT = config.SERVER_PORT;
const app = express();

// Для возможности загрузки файлов на сервер
app.use(fileUpload({}));
// Cors политика
app.use(corsMiddleware);
// Для возможности работы с .json файлами
app.use(express.json());
// Roots
app.use("/api/auth", userRouter);
app.use("/api/files", fileRouter);

app.listen(PORT, () => console.log("server started on port", PORT));
