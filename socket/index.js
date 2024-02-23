const { Server, Socket } = require("socket.io");

const io = new Server({ cors: "*" });

let onlineUser = [];

io.on("connection", (Socket) => {
    console.log(`===>New connect socket id `, Socket.id);

    // listen to a connection
    Socket.on("addNewUser", (userId) => {
        !onlineUser.some((user) => {
            return user.userId === userId;
        }) &&
            onlineUser.push({
                userId,
                socketId: Socket.id,
            });
        console.log(`===>onlineUser  :`, onlineUser);

        io.emit("getOnlineUsers", onlineUser);
    });

    // add message
    Socket.on("sendMessage", (message) => {
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
            // io.emit("getMessage", message);
        }
    });

    // hàm có sẵn disconnect
    Socket.on("disconnect", () => {
        onlineUser = onlineUser.filter((user) => user.socketId !== Socket.id);

        io.emit("getOnlineUsers", onlineUser);
    });
});

io.listen(3000);
