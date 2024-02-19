import React, { createContext, useCallback, useEffect, useState } from "react";
import { postRequest } from "../utils/services";

export const AuthContext = createContext();

// Đây là đúng ở context nên là nó khởi tạo hết rồi mới đi vô trong ==> App!

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerError, seRegisterError] = useState(null);
    const [loginError, seLoginError] = useState(null);
    const [isRegisterLoading, seIsRegisterLoading] = useState(false);
    const [isLoginLoading, seIsLoginLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState();
    const [loginInfo, setLoginInfo] = useState();

    //Lấy user từ local
    useEffect(() => {
        const user = localStorage.getItem("user");
        // console.log(`===>OKE: user:`, user);
        setUser(JSON.parse(user));
    }, []);

    const updateRegisterInfo = useCallback(
        (info) => {
            setRegisterInfo(info);
        },
        [registerInfo]
    );
    // onSubmit của form cho mày e
    const registerUser = useCallback(
        async (e) => {
            // Ngăn reload
            e.preventDefault();
            seIsRegisterLoading(true);
            seRegisterError(null);
            // Request
            const responseData = await postRequest(
                "/users/register",
                JSON.stringify(registerInfo)
            );
            seIsRegisterLoading(false);
            // Lỗi
            if (!responseData.oke) {
                // Tạm thời để lỗi từ sever về luôn!
                seRegisterError(responseData.data);
            } else {
                // K lỗi
                localStorage.setItem("user", JSON.stringify(responseData));
                setUser(responseData);
            }
        },
        [registerInfo]
    );

    const updateLoginInfo = useCallback(
        (info) => {
            setLoginInfo(info);
        },
        [loginInfo]
    );

    const loginUser = useCallback(
        async (e) => {
            // Ngăn reload
            e.preventDefault();
            seIsLoginLoading(true);
            seLoginError(null);
            // Request
            const responseData = await postRequest(
                "/users/login",
                JSON.stringify(loginInfo)
            );
            seIsLoginLoading(false);
            // Lỗi
            if (!responseData.oke) {
                // Tạm thời để lỗi từ sever về luôn!
                seLoginError(responseData.data);
            } else {
                // K lỗi
                localStorage.setItem("user", JSON.stringify(responseData));
                setUser(responseData);
            }
        },
        [loginInfo]
    );

    const logoutUser = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
    }, []);
    return (
        <AuthContext.Provider
            value={{
                user,
                registerInfo,
                updateRegisterInfo,
                registerError,
                registerUser,
                isRegisterLoading,
                logoutUser,
                loginInfo,
                loginError,
                isLoginLoading,
                updateLoginInfo,
                loginUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
