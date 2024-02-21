import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
// Import Moment.js
import moment from "moment";

import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/chatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessagesLoading, messageError } =
        useContext(ChatContext);
    // Dùng hooks này Sang bên kia lấy thằng vừa được ấn chat với mk
    // console.log(`===>currentChat:hat box: `, currentChat);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    // console.log(`===>recipientUser Chat box: `, recipientUser);
    console.log(`===>user Chat box: `, user);
    // console.log(`===>messages Chat box: `, messages);

    if (!recipientUser) {
        return (
            <p style={{ textAlign: "center", width: "100%", paddingTop: 20 }}>
                No conversation selected yet...
            </p>
        );
    }

    if (isMessagesLoading) {
        return (
            <p
                style={{
                    textAlign: "center",
                    width: "100%",
                    paddingTop: 20,
                }}
            >
                Loading chat...
            </p>
        );
    }

    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.data.name}</strong>
            </div>

            <Stack gap={3} className="messages">
                {messages &&
                    messages?.data.map((message, index) => {
                        return (
                            <Stack
                                key={index}
                                className={`${
                                    message?.senderId === user?.id
                                        ? "message self align-self-end flex-grow-0"
                                        : "message align-self-start flex-grow-0"
                                }`}
                            >
                                <span> {message.message}</span>
                                <span className="message-footer">
                                    {moment(message.createdAt).calendar()}
                                </span>
                            </Stack>
                        );
                    })}
            </Stack>
        </Stack>
    );
};

export default ChatBox;
