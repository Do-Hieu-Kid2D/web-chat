const express = require("express");
const http = require("http"); // Thêm module 'http'
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); // Tạo một máy chủ HTTP từ ứng dụng Express

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

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
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
    res.send("Welcome to chat web api");
});

app.get("/api/dataiot", (req, res) => {
    fetch("http://192.168.1.103:1880/data")
        .then((response) => response.json())
        .then((data) => {
            console.log(`===>response json: `, data);
            res.send(data);
        })
        .catch((err) => {
            console.error(`===>ERROR: Lỗi lấy data Raspberry!`, err);
            res.send(
                `<h1 style="color:red;text-align:center" >LỖI ÁC ANH ƠI </h1> <h3 style="color:#cc6600;text-align:center" >Lỗi lấy data Raspberry! Chắc thằng này chưa bật Senhat Emulator thì nó lấy bằng mắt</h3>`
            );
        });
});

app.get("/api/online", (req, res) => {
    res.json({
        oke: 1,
        data: onlineUser.length,
    });
});

const port = process.env.PORT || 5100;
const mongo_uri = process.env.MONGO_URI;

let onlineUser = [];

// Kết nối Socket.IO với máy chủ HTTP đã tạo
io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Xử lý sự kiện "addNewUser"
    socket.on("addNewUser", (userId) => {
        !onlineUser.some((user) => {
            return user.userId === userId;
        }) &&
            onlineUser.push({
                userId,
                socketId: socket.id,
            });
        console.log(`===>onlineUser  :`, onlineUser);

        io.emit("getOnlineUsers", onlineUser);
    });

    // Xử lý sự kiện "sendMessage"
    socket.on("sendMessage", (message) => {
        console.log(`===>have an sendMessage: `, message);
        // cần lấy socket id
        const user = onlineUser.find(
            (user) => user.userId === message.recipientId
        );

        if (user) {
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date(),
            });
        }
    });

    // Xử lý sự kiện "disconnect"
    socket.on("disconnect", () => {
        onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUser);
    });
});

// Lắng nghe cổng và địa chỉ IP 0.0.0.0
server.listen(port, "0.0.0.0", () => {
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
