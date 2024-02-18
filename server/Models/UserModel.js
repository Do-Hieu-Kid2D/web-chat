const mongoose = require("mongoose");

// Tạo schema chỉ định cấu trúc obj muốn lưu
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 30 },
        email: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            minlength: 8,
            maxlength: 1024,
        },
    },
    { timestamps: true }
);

// Tạo Model từ schema để dùng nó thao tác với DB chứ schema k gọi đc DB
// Hình như nó tự chuyển User thành => Users
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
