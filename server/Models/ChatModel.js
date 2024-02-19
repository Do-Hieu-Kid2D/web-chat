const mongoose = require("mongoose");

// Tạo schema chỉ định cấu trúc obj muốn lưu
const chatSchema = new mongoose.Schema(
    {
        members: Array,
    },
    { timestamps: true }
);

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;
