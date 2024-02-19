const express = require("express");
const {
    createMessage,
    getMessage,
} = require("../Controllers/messageController");

const messageRouter = express.Router();

messageRouter.post("/", createMessage);
messageRouter.get("/:chatId", getMessage);

module.exports = messageRouter;
