import { useContext } from "react";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    // Phần user chưa chat bao h với mk ở trên cùng
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat } = useContext(ChatContext);
    // console.log(`===>PotentialChats: `, potentialChats);
    return (
        <>
            <div className="all-users">
                {potentialChats &&
                    potentialChats.map((u, index) => {
                        return (
                            <div
                                className="single-user"
                                key={index}
                                onClick={() => {
                                    createChat(user.id, u._id);
                                }}
                            >
                                {u.name}
                                <span className="user-online"></span>
                            </div>
                        );
                    })}
            </div>
        </>
    );
};

export default PotentialChats;
