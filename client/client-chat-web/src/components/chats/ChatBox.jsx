import { useContext, useEffect, useRef, useState } from "react";
import { Container, Stack } from "react-bootstrap";
// Import Moment.js
import moment from "moment";
import InputEmoji from "react-input-emoji";

import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/chatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const {
        currentChat,
        messages,
        isMessagesLoading,
        messageError,
        sendTextMessage,
    } = useContext(ChatContext);
    const [textMessage, setTextMessage] = useState("");
    // Dùng hooks này Sang bên kia lấy thằng vừa được ấn chat với mk
    // console.log(`===>currentChat:hat box: `, currentChat);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    const scroll = useRef();
    const inputRef = useRef(null);

    // console.log(`===>recipientUser Chat box: `, recipientUser);
    // console.log(`===>user Chat box: `, user);
    // console.log(`===>messages Chat box: `, JSON.stringify(messages));
    // console.log(`===>text: `, textMessage);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendTextMessage(
                textMessage,
                user.id,
                currentChat._id,
                setTextMessage
            );
        }
    };

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
                                ref={scroll}
                            >
                                <span> {message.message}</span>
                                <span className="message-footer">
                                    {moment(message.createdAt).calendar()}
                                </span>
                            </Stack>
                        );
                    })}
            </Stack>
            <Stack
                direction="horizontal"
                className="chat-input flex-grow-0"
                gap={3}
            >
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    fontFamily="nunito"
                    borderColor="rgba(72,112,223,0.2)"
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                />
                <button
                    className="send-btn"
                    onClick={() => {
                        sendTextMessage(
                            textMessage,
                            user.id,
                            currentChat._id,
                            setTextMessage
                        );
                        inputRef.current.focus(); // Sau khi gửi tin nhắn, tập trung vào ô nhập văn bản
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-send-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                    </svg>
                </button>
            </Stack>
        </Stack>
    );
};

export default ChatBox;
