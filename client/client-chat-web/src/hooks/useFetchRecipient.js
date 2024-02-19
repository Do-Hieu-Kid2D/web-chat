// fetch => tìm
// recipient => người nhận

import { useEffect, useState } from "react";
import { getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    // Mấy cái mà de lặp qua thì mỗi lần lặp nó cho 1 phàn tử trong magr như foreach ý, ngu thế
    const recipientId = chat?.members.find((id) => {
        return id !== user?.id;
    });
    // Lấy được thằng chat với mk trong mảng gồm 2 thằng rồi
    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null;
            const responseData = await getRequest(`/users/find/${recipientId}`);

            if (!responseData.oke) {
                return setError(responseData.data);
            }

            setRecipientUser(responseData);
        };
        getUser();
    }, []);

    return { recipientId, recipientUser };
};
