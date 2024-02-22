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
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    // console.log(`===>currentChat: 11111111111 `, currentChat);
    // console.log(`===>messages : message111111111 `, JSON.stringify(messages));
    // console.log(`===>onlineUsers :  `, onlineUsers);
    console.log(`===>notification :  `, notifications);

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

    // useEffect(() => {
    //     const getNewMessageForCurrentChat = async () => {
    //         setIsMessagesLoading(true);
    //         setMessageError(null);
    //         const response = await getRequest(`/messages/${currentChat.id}`);
    //         setIsMessagesLoading(false);
    //         console.log(`===>getNewMessageForCurrentChat: `, response);
    //         // setMessages(response);
    //     };
    // }, [currentChat]);

    // receive message and notifications
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
            setMessages((prevMessages) => {
                return {
                    ...prevMessages,
                    data: [...prevMessages.data, res],
                };
            });
        });

        socket.on("getNotification", async (res) => {
            const isChatOpen = currentChat?.members.includes(res.senderId);
            if (isChatOpen) {
                setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
            } else {
                setNotifications((prev) => [res, ...prev]);
            }
        });

        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        };
    }, [socket, currentChat]);

    // const chatIdTalk = res.chatId;
    // setIsMessagesLoading(true);
    // setMessageError(null);
    // const response = await getRequest(`/messages/${chatIdTalk}`);
    // setIsMessagesLoading(false);
    // setMessages(response);
    // JSON.parse(
    //     `{"oke":1,"data":[{"_id":"65d69da2576fec2f8ae0f7e0","chatId":"65d69d97576fec2f8ae0f7d1","senderId":"65d5d595cdf6434876a155a2","message":"1","createdAt":"2024-02-22T01:04:34.465Z","updatedAt":"2024-02-22T01:04:34.465Z","__v":0},{"_id":"65d69df9576fec2f8ae0f7e2","chatId":"65d69d97576fec2f8ae0f7d1","senderId":"65d5d54ecdf6434876a1558f","message":"đó","createdAt":"2024-02-22T01:06:01.667Z","updatedAt":"2024-02-22T01:06:01.667Z","__v":0},{"_id":"65d69e59576fec2f8ae0f830","chatId":"65d69d97576fec2f8ae0f7d1","senderId":"65d5d54ecdf6434876a1558f","message":"res","createdAt":"2024-02-22T01:07:37.622Z","updatedAt":"2024-02-22T01:07:37.622Z","__v":0}]}`
    // );

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
                setAllUsers(responseData);
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
            console.log(
                `===>currentChat change : getMessagesChat = `,
                response
            );
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

    const markAllNoti = useCallback((noti) => {
        const mNoti = noti.map((n) => {
            return { ...n, isRead: true };
        });
        setNotifications(mNoti);
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
                notifications,
                allUsers,
                markAllNoti,
                newMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
