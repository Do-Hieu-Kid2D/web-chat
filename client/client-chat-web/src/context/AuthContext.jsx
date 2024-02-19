import React, { createContext, useCallback, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerInfo, setRegisterInfo] = useState({
        email: "",
        name: "",
        password: "",
    });

    console.log(`===>OKE: `, registerInfo);

    const updateRegisterInfo = useCallback(
        (info) => {
            setRegisterInfo(info);
        },
        []
    );

    return (
        <AuthContext.Provider
            value={{ user, registerInfo, updateRegisterInfo }}
        >
            {children}
        </AuthContext.Provider>
    );
};
