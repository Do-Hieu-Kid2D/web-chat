export const unRedNotificationFunc = (notifications) => {
    return notifications.filter((n) => n.isRead === false);
};
