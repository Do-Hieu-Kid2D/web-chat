// fetch => tìm
// recipient => người nhận

import { useContext, useEffect, useState } from "react";
import { getRequest } from "../utils/services";
import { ChatContext } from "../context/chatContext";

export const useFetchLastMess = (chat) => {
    const { notifications, newMessage } = useContext(ChatContext);
    const [latsMess, setLastMess] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`/messages/${chat?._id}`);
            const lastMess_ = response.data[response.data.length - 1];
            setLastMess(lastMess_);
            console.log(`===>lasssssssssssssssssst : `, lastMess_);
        };
        getMessages();
    }, [newMessage, notifications]);
    return { latsMess };
};
