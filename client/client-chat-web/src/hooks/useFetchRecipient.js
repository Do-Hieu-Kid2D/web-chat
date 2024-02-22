// fetch => tìm
// recipient => người nhận

import { useEffect, useState } from "react";
import { getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    // Mấy cái mà de lặp qua thì mỗi lần lặp nó cho 1 phàn tử trong magr như foreach ý, ngu thế

    // trả về string id của thằng bên component userChat muôn gọi
    const recipientId = chat?.members.find((id) => {
        return id !== user?.id;
    });

    // const other = chat?.members.find((id) => {
    //     return id == user?.id;
    // });

    // console.log(`===>OKE:typeof recipientId `, typeof recipientId);
    // Lấy được thằng chat với mk trong mảng gồm 2 thằng rồi
    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null;
            const responseData = await getRequest(`/users/find/${recipientId}`);
            // console.log(`===>responseData : `, responseData);

            if (!responseData.oke) {
                return setError(responseData.data);
            }

            setRecipientUser(responseData);
        };
        getUser();
    }, [recipientId]);
    // console.log(`===>return recipientUser: `, recipientUser);

    return { recipientId, recipientUser };
};
