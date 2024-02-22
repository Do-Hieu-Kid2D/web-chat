import {
    Children,
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react";
import { getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatError, setUserChatError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [isReloadUserChats, setIsReloadUserChats] = useState(1);
    // const [isReloadMessages, setReloadMessages] = useState(1);

    // Thằng đang chat với mk
    const [currentChat, setCurrentChat] = useState(null);

    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const [messages, setMessages] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);

    // console.log(`===>currentChat: 11111111111 `, currentChat);
    // console.log(`===>messages : message111111111 `, JSON.stringify(messages));
    // console.log(`===>onlineUsers :  `, onlineUsers);

    // init socket lấy socket lưu vào state
    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // lấy socket từ state ra dùng
    // add onlineUser
    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", user?.id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        // hàm clean làm gì
        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket]);

    // send messages
    useEffect(() => {
        if (socket === null) return;

        const recipientId = currentChat?.members.find((id) => {
            return id !== user?.id;
        });
        const data = { ...newMessage, recipientId };
        console.log(`===>Gửi sendMessages đến socket : `, data);
        socket.emit("sendMessage", data);
    }, [newMessage]);

    // receive message
    useEffect(() => {
        if (socket === null) {
            console.log(`===> receive message socket === null`);
            return;
        }

        socket.on("getMessage", async (res) => {
            console.log(`===> Socket cho 1 getMessage `, res);
            // lấy đc đối tượng tin nhắn mới nhưng k chuẩn,
            // lấy ra id thawngd nhắn với mk thiooi, về DB lấy nd chuẩn
            if (currentChat?._id !== res.chatId) {
                console.log(`===>currentChat?._id !== res.chatId:  => return`);
                return;
            }
            const chatIdTalk = res.chatId;
            setIsMessagesLoading(true);
            setMessageError(null);
            const response = await getRequest(`/messages/${chatIdTalk}`);
            setIsMessagesLoading(false);
            setMessages(response);
        });

        return () => {
            socket.off("getMessage");
        };
    }, [socket, currentChat]);

    useEffect(() => {
        // Thằng này lọc ra những thằng chưa bao h chat với mk
        // Để làm phần có thể chat tiếp
        const getUsers = async () => {
            try {
                const responseData = await getRequest("/users");
                const pChats = responseData.data.filter((u) => {
                    let isChatCreated = false;
                    if (user?.id == u._id) {
                        return false;
                    }
                    // console.log(`===>userChats: `, userChats);
                    if (userChats) {
                        isChatCreated = userChats?.data.some((chat) => {
                            return (
                                chat.members[0] === u._id ||
                                chat.members[1] === u._id
                            );
                        });
                    }

                    return !isChatCreated;
                });
                // console.log(`===>pChats: `, pChats);
                setPotentialChats(pChats);
            } catch (error) {
                console.error(`===>ERROR: Lỗi khi lấy all user`, error);
            }
        };
        getUsers();
    }, [userChats]);

    useEffect(() => {
        // lên lấy user mới nhất cơ?
        // console.log(`===>Chat nhận được user: `, user);
        const getUserChats = async () => {
            if (user?.id) {
                setIsUserChatLoading(true);
                setUserChatError(null);
                const response = await getRequest(`/chats/${user?.id}`);
                // console.log(`===>lấy useEffect: response`, response);
                setIsUserChatLoading(false);

                if (!response.oke) {
                    return setUserChatError(response.data);
                }
                setUserChats(response);
                // console.log(`===>response : userchat `, response);
            }
        };
        getUserChats();
    }, [user, isReloadUserChats]);

    const updateCurrentChat = useCallback((chat) => {
        // chat này là Uer Chat truyền cho
        setCurrentChat(chat);
    }, []);

    useEffect(() => {
        const getMessagesChat = async () => {
            setIsMessagesLoading(true);
            setMessageError(null);
            const response = await getRequest(`/messages/${currentChat?._id}`);
            // console.log(`===>lấy useEffect: response`, response);
            // console.log(`===>messages :ccccalllll `, response);

            setIsMessagesLoading(false);

            if (!response.oke) {
                return setMessageError(response.data);
            }
            // setUserChats(response);
            console.log(`===>response : getMessagesChat `, response);
            setMessages(response);
        };
        getMessagesChat();
    }, [currentChat]);

    const sendTextMessage = useCallback(
        async (textMessage, sender, currentChatId, setTextMessage) => {
            if (!textMessage) return console.log(`===>ERR nhập đi rồi gửi`);

            const response = await postRequest(
                `/messages`,
                JSON.stringify({
                    chatId: currentChatId,
                    senderId: sender,
                    message: textMessage,
                })
            );
            if (!response.oke) {
                return setSendTextMessageError(response.data);
            }
            setNewMessage(response.data);
            setTextMessage("");
            // console.log(`===>messages sendTextMessage : `, messages);
            // push thằng response.data vào messages.data là ăn
            let newStateMessage = { ...messages };
            newStateMessage.data.push(response.data);
            // console.log(`===>newStateMessage: `, newStateMessage);
            setMessages(newStateMessage);
        },
        [messages]
    );

    const createChat = useCallback(async (firstId, secondId) => {
        const responseData = await postRequest(
            `/chats`,
            JSON.stringify({ firstId, secondId })
        );
        console.log(`===>createChat: `, responseData);
        if (!responseData.oke) {
            console.error(`===>ERROR: Lỗi khi tạo chat`);
        }
        console.log(`===>userChats: `, userChats);
        const timestamp = new Date().getTime();
        setIsReloadUserChats(timestamp);
    }, []);

    return (
        <ChatContext.Provider
            value={{
                userChatError,
                isUserChatLoading,
                userChats,
                user,
                potentialChats,
                createChat,
                updateCurrentChat,
                messages,
                isMessagesLoading,
                messageError,
                currentChat,
                sendTextMessage,
                onlineUsers,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
