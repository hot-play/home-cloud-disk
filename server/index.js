const express = require("express");
const userRouter = require("./routes/user.routes");
const corsMiddleware = require("./middleware/cors.middleware");

const PORT = 5000;

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", userRouter);

app.listen(PORT, () => console.log("server started on port", PORT));
