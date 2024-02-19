const mongoose = require("mongoose");
const severCode = require("../constant/statusCode");

// Tạo schema chỉ định cấu trúc obj muốn lưu
const messageSchema = new mongoose.Schema(
    {
        chatId: String,
        senderId: String,
        message: String,
    },
    { timestamps: true }
);

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;
