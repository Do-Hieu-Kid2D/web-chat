const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const { userRouter, chatRouter, messageRouter } = require("./Routers/index.js");

// config
require("dotenv").config();
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

// Router
app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
    res.send("Welcome to chat web api");
});

const port = process.env.PORT || 5000;
const mongo_uri = process.env.MONGO_URI || 5000;
// Lắng nghe cổng và địa chỉ IP 0.0.0.0
app.listen(port, "0.0.0.0", () => {
    console.log(
        `Sever Nodejs đang lắng nghe tại đường http://localhost:${port}`
    );
});

mongoose
    .connect(mongo_uri)
    .then(() => {
        console.log("===>OKE: Kết nối MOGODB thành công!");
    })
    .catch((err) => {
        console.error("===>ERR: kết nối MONGODB thất bại!", err.message);
    });
