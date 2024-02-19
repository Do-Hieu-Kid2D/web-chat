const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const severCode = require("../constant/statusCode");
const { generateToken, verifyToken } = require("../utils/jwt");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("ĐĂNG KÝ USER:", name, email, password);
        // findOne trả về 1 dữ liệu đầu tiên thôi
        let user = await userModel.findOne({ email });
        if (user) {
            console.error(`===>ERROR: K QUA TƯỜNG LỬA`);
            return res.status(severCode.BAD_REQUEST_400.code).json({
                oke: 0,
                data:
                    severCode.BAD_REQUEST_400.message +
                    " User with the given email already exist...",
            });
        }
        if (!name || !password || !email) {
            console.error(`===>ERROR: K QUA TƯỜNG LỬA`);
            return res.status(severCode.BAD_REQUEST_400.code).json({
                oke: 0,
                data:
                    severCode.BAD_REQUEST_400.message +
                    " All fields are required...",
            });
        }
        if (!validator.isEmail(email)) {
            console.error(`===>ERROR: K QUA TƯỜNG LỬA`);
            return res.status(severCode.BAD_REQUEST_400.code).json({
                oke: 0,
                data:
                    severCode.BAD_REQUEST_400.message +
                    " Email must valid email...",
            });
        }
        if (password.length < 8) {
            console.error(`===>ERROR: K QUA TƯỜNG LỬA`);
            return res.status(severCode.BAD_REQUEST_400.code).json({
                oke: 0,
                data:
                    severCode.BAD_REQUEST_400.message +
                    " Password must more than or equal 8 characters...",
            });
        }

        if (name.length < 3) {
            console.error(`===>ERROR: K QUA TƯỜNG LỬA`);
            return res.status(severCode.BAD_REQUEST_400.code).json({
                oke: 0,
                data:
                    severCode.BAD_REQUEST_400.message +
                    "Name must more than or equal 3 characters...",
            });
        }

        // Hết lỗi => k biết Db có tả lỗi catch k
        user = new userModel({ email, password, name });
        // salt được render ngẫu nhiên nhưng nó được lưu cùng mật khẩu hash nên....
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const newUser = await user.save();
        console.log(`===>OKE: registerUser`, newUser);
        // tạo token từ newUser
        try {
            const token = generateToken(newUser);
            console.log("===> OKE: NEW TOKEN: ", token);
            res.status(severCode.OKE_REQUEST_200.code).json({
                oke: 1,
                data: token,
                name: newUser.name,
                email: newUser.email,
            });
        } catch {
            console.error("===>ERR: LỖI KHI TẠO TOKEN CHO USER MỚI");
        }
    } catch (error) {
        console.error("===>ERROR ALL register: ", error);
        return res.status(severCode.BAD_REQUEST_400.code).json({
            oke: 0,
            data: severCode.BAD_REQUEST_400.message + " K RÕ LỖI GÌ",
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(severCode.BAD_REQUEST_400.code).json({
                oke: 0,
                data:
                    severCode.BAD_REQUEST_400.message +
                    " Invalid email or password...",
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        // Mật khẩu k đúng
        if (!isValidPassword) {
            return res.status(severCode.BAD_REQUEST_400.code).json({
                oke: 0,
                data:
                    severCode.BAD_REQUEST_400.message +
                    " Invalid email or password...",
            });
        }

        // Login thì lại cho nó token
        const token = generateToken(user);
        console.log(`===>OKE: CÓ THẰNG VỪA ĐĂNG NHẬP HỆ THỐNG TOKEN`, token);
        res.status(severCode.OKE_REQUEST_200.code).json({
            oke: 1,
            data: token,
            email: user.email,
            name: user.name,
        });
    } catch (error) {
        console.error(`===>ERROR All login: `, error);
        return res.status(severCode.BAD_REQUEST_400.code).json({
            oke: 0,
            data: severCode.BAD_REQUEST_400.message + " K RÕ LỖI GÌ",
        });
    }
};

const findUser = async (req, res) => {
    const userId = req.params.userId; // Giả sử userId được truyền qua route parameters

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(severCode.NOT_FOUND_404.code).json({
                oke: 0,
                data: severCode.NOT_FOUND_404.message + " User not found...",
            });
        }

        res.status(severCode.OKE_REQUEST_200.code).json({
            oke: 1,
            data: user,
        });
    } catch (error) {
        console.error("===>ERROR findUser: ", error);
        return res.status(severCode.INTERNAL_SERVER_ERROR_500.code).json({
            oke: 0,
            data: severCode.INTERNAL_SERVER_ERROR_500.message + " K RÕ LỖI GÌ",
        });
    }
};
const getUsers = async (req, res) => {
    try {
        const user = await userModel.find();
        if (!user) {
            return res.status(severCode.NOT_FOUND_404.code).json({
                oke: 0,
                data:
                    severCode.NOT_FOUND_404.message + "All Users not found...",
            });
        }
        res.status(severCode.OKE_REQUEST_200.code).json({
            oke: 1,
            data: user,
        });
    } catch (error) {
        console.error("===>ERROR  ALL getUsers: ", error);
        return res.status(severCode.INTERNAL_SERVER_ERROR_500.code).json({
            oke: 0,
            data: severCode.INTERNAL_SERVER_ERROR_500.message + " K RÕ LỖI GÌ",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    findUser,
    getUsers,
};
