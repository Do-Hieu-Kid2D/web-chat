const chatModel = require("../Models/ChatModel");
const severCode = require("../constant/statusCode");

// createChat ==> tạo 1 cặp chat giữa 2 người
// getUserChat ==> lấy ra 1 user chat qua id xem nó đang chat với những ai
// findChat ==> lấy ra 1 cặp chat giữa 2 người

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;
    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] },
        });

        if (chat) {
            return res.status(severCode.OKE_REQUEST_200.code).json({
                oke: 1,
                data: chat,
            });
        }

        const newChat = new chatModel({
            members: [firstId, secondId],
        });
        const newChatSave = await newChat.save();
        res.status(severCode.OKE_REQUEST_200.code).json({
            oke: 1,
            data: newChatSave,
        });
    } catch (error) {
        console.error(`===>ERROR: createChat`, error);
        res.status(severCode.INTERNAL_SERVER_ERROR_500.code).json({
            oke: 0,
            data: severCode.INTERNAL_SERVER_ERROR_500.message,
        });
    }
};

const findUserChat = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] },
        });
        res.status(severCode.OKE_REQUEST_200.code).json({
            oke: 1,
            data: chats,
        });
    } catch (error) {
        console.error(`===>ERROR: findUserChat `, error);
        res.status(severCode.INTERNAL_SERVER_ERROR_500.code).json({
            oke: 0,
            data: severCode.INTERNAL_SERVER_ERROR_500.message,
        });
    }
};

const findChat = async (req, res) => {
    const { firstId, secondId } = req.params;

    try {
        const chat = await chatModel.find({
            members: { $all: [firstId, secondId] },
        });
        res.status(severCode.OKE_REQUEST_200.code).json({
            oke: 1,
            data: chat,
        });
    } catch (error) {
        console.error(`===>ERROR: findChat `, error);
        res.status(severCode.INTERNAL_SERVER_ERROR_500.code).json({
            oke: 0,
            data: severCode.INTERNAL_SERVER_ERROR_500.message,
        });
    }
};

module.exports = {
    createChat,
    findUserChat,
    findChat,
};
