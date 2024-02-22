import { useContext, useState } from "react";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/AuthContext";
import { unRedNotificationFunc } from "../utils/unRedNotification";
import moment from "moment";

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, allUsers, markAllNoti } = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const unRedNotifications = unRedNotificationFunc(notifications);
    // console.log(`===>unRedNotifications: nnnnnnnnnnn `, unRedNotifications);
    const modifyNoti = notifications.map((n) => {
        const sender = allUsers.data.find((user) => user._id === n.senderId);

        return {
            ...n,
            senderName: sender?.name,
        };
    });

    console.log(`===>unRedNotifications: `, unRedNotifications);
    console.log(`===>modifyNoti: `, modifyNoti);
    return (
        <div className="notifications">
            <div
                className="notifications-icon"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    className="bi bi-chat-fill"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15" />
                </svg>
                {/* <span className="notification-count">3</span> */}
                {unRedNotifications?.length === 0 ? null : (
                    <span className="notification-count">
                        {unRedNotifications?.length}
                    </span>
                )}
            </div>
            {isOpen ? (
                <div className="notifications-box">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        <div
                            className="mark-as-read"
                            onClick={() => {
                                markAllNoti(notifications);
                            }}
                        >
                            Mask all as read
                        </div>
                    </div>
                    {modifyNoti?.length === 0 ? (
                        <span className="notification">
                            No notifications yet...
                        </span>
                    ) : null}
                    {modifyNoti &&
                        modifyNoti.map((n, index) => {
                            return (
                                <div
                                    key={index}
                                    className={
                                        n.isRead
                                            ? "notification"
                                            : "notification not-read"
                                    }
                                >
                                    <span>{`${n.senderName} sent you a messages`}</span>
                                    <span className="notification-time">
                                        {moment(n.date).calendar()}
                                    </span>
                                </div>
                            );
                        })}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default Notification;
