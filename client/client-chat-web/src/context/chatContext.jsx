import {
    Children,
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react";
import { getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatError, setUserChatError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [isReloadUserChats, setIsReloadUserChats] = useState(1);

    // Thằng đang chat với mk
    const [currentChat, setCurrentChat] = useState(null);

    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const [messages, setMessages] = useState(null);

    // console.log(`===>currentChat: `, currentChat);
    // console.log(`===>messages : message `, message);

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
                console.log(`===>response : userchat `, response);
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
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
