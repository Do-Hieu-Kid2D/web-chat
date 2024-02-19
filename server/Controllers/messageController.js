const messageModel = require("../Models/MessageModel");
const severCode = require("../constant/statusCode");

/// Tạo và lấy tin nhắn giưa 2 người được xác định bởi chat id trong document chats
// create message
// getMessage

const createMessage = async (req, res) => {
    const { chatId, senderId, message } = req.body;
    const newMessage = new messageModel({
        chatId,
        senderId,
        message,
    });

    try {
        const newMessageSave = await newMessage.save();
        res.status(severCode.OKE_REQUEST_200.code).json({
            oke: 1,
            data: newMessageSave,
        });
    } catch (error) {
        console.error(`===>ERROR: createMessage`, error);
        res.status(severCode.INTERNAL_SERVER_ERROR_500.code).json({
            oke: 0,
            data: severCode.INTERNAL_SERVER_ERROR_500.message,
        });
    }
};

const getMessage = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await messageModel.find({ chatId });
        res.status(severCode.OKE_REQUEST_200.code).json({
            oke: 1,
            data: messages,
        });
    } catch (error) {
        console.error(`===>ERROR: createMessage`, error);
        res.status(severCode.INTERNAL_SERVER_ERROR_500.code).json({
            oke: 0,
            data: severCode.INTERNAL_SERVER_ERROR_500.message,
        });
    }
};

module.exports = {
    createMessage,
    getMessage,
};
