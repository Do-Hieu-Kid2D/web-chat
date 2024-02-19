const express = require("express");
const {
    registerUser,
    loginUser,
    findUser,
    getUsers,
} = require("../Controllers/userController");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/find/:userId", findUser);
userRouter.get("/", getUsers);

module.exports = userRouter;
