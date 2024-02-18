require("dotenv").config();
const jwt = require("jsonwebtoken");

// SECRET_KEY trong mã JWT là một chuỗi bí mật được sử dụng để ký và xác thực token.
// Khi một token JWT được tạo ra, nó được ký bằng SECRET_KEY, và khi một token được gửi đến máy chủ để xác thực,
// máy chủ sẽ sử dụng cùng một SECRET_KEY để kiểm tra tính hợp lệ của chữ ký trong token./

const SECRET_KEY = process.env.SECRET_KEY;
const expiresIn = 3600; // Ví dụ: token hết hạn sau 1 giờ

// Hàm tạo token từ dữ liệu payload
function generateToken(payload) {
    try {
        const token = jwt.sign(payload.toJSON(), SECRET_KEY, { expiresIn });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        return null;
    }
}

// Hàm xác thực token và trả về dữ liệu payload
function verifyToken(token) {
    try {
        const payload = jwt.verify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}

module.exports = { generateToken, verifyToken };
