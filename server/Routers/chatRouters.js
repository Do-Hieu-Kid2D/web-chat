const express = require("express");
const {
    createChat,
    findUserChat,
    findChat,
} = require("../Controllers/chatController");

const chatRouter = express.Router();

chatRouter.post("/", createChat);
chatRouter.get("/:userId", findUserChat);
chatRouter.get("/find/:firstId/:secondId", findChat);

module.exports = chatRouter;
