import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Container, Stack } from "react-bootstrap";
import male_avarter from "../../assets/male_avatar.svg";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/chatContext";
import { unRedNotificationFunc } from "../../utils/unRedNotification";
import { useFetchLastMess } from "../../hooks/useFetchLastMess";
import moment from "moment";

const UserChat = ({ chat, user }) => {
    // console.log(`===>OKE: Chat item`, chat);
    // console.log(`===>OKE: user item`, user);

    // đây là 1 thằng bên thanh chờ chat recipientUser là thằng bên thanh chat chứ
    const { recipientId, recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers, notifications } = useContext(ChatContext);
    const unReadNotifications = unRedNotificationFunc(notifications);
    const { latsMess } = useFetchLastMess(chat);
    // console.log(`===>chat     99999999999999999: `, chat);

    const thisUserNoti = unReadNotifications?.filter((n) => {
        return n.senderId === recipientUser?._id;
    });

    const truncateText = (text) => {
        let shortText = text.substring(0, 25);
        if (text.length > 25) {
            shortText = shortText + "...";
        }
        return shortText;
    };

    // console.log(`===>unReadNotifications: `, unReadNotifications);
    // console.log(`===>thisUserNoti: `, thisUserNoti);

    const isOnline = onlineUsers?.some((user) => user.userId === recipientId);

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
                    <div className="text">
                        {latsMess?.message.length > 0
                            ? truncateText(latsMess?.message)
                            : ""}
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    {moment(latsMess?.createdAt).calendar()}
                </div>
                <div
                    className={
                        thisUserNoti?.length > 0
                            ? "this-user-notifications"
                            : ""
                    }
                >
                    {thisUserNoti?.length > 0 ? thisUserNoti?.length : ""}
                </div>
                <div className={isOnline ? "user-online" : ""}></div>
            </div>
        </Stack>
    );
};

export default UserChat;
