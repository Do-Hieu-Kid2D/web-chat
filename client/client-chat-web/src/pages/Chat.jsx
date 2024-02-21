import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chats/UserChat";
import PotentialChats from "../components/chats/PotentialChats";
import ChatBox from "../components/chats/ChatBox";

const Chat = () => {
    // User là thằng đang đăng nhập
    const { user } = useContext(AuthContext);
    // userChats chứa mảng về thằng đang đăng nhập chat với thằng nào để xuống kia map lấy UI
    const { userChatError, isUserChatLoading, userChats, updateCurrentChat } =
        useContext(ChatContext);
    // console.log(`===>OKE: UserChat với mk: `, userChats);
    // console.log("typeof", typeof userChats);

    return (
        <Container style={{ color: "white" }}>
            <PotentialChats />
            {userChats?.length < 1 ? null : (
                <Stack
                    direction="horizontal"
                    gap={4}
                    className=" align-items-start"
                >
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatLoading && <p>Loading chats....</p>}

                        {userChats?.data.map((chat, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        updateCurrentChat(chat);
                                    }}
                                >
                                    <UserChat chat={chat} user={user} />
                                </div>
                            );
                        })}
                    </Stack>
                    <ChatBox></ChatBox>
                </Stack>
            )}
        </Container>
    );
};

export default Chat;
