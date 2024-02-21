import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Container, Stack } from "react-bootstrap";
import male_avarter from "../../assets/male_avatar.svg";

const UserChat = ({ chat, user }) => {
    // console.log(`===>OKE: Chat item`, chat);
    // console.log(`===>OKE: user item`, user);
    
    // đây là 1 thằng bên thanh chờ chat
    const { recipientId, recipientUser } = useFetchRecipientUser(chat, user);

    // console.log(`===>chat recipientId : `, recipientId);
    // console.log(`===>chat recipientUser : `, recipientUser);
    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
        >
            <div className="d-flex align-items-center">
                <div className="me-2" style={{ marginTop: "-15px" }}>
                    <img src={male_avarter} height="40px" />
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.data.name}</div>
                    <div className="text">Text messages</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">19/02/2024</div>
                <div className="this-user-notifications">6</div>
                <div className="user-online"></div>
            </div>
        </Stack>
    );
};

export default UserChat;
