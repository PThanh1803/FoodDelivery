import { createContext, useEffect, useState } from "react";
import axios from "axios";
import APIClient from "../client";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000";
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // Initialize from localStorage
    const [adminInfo, setAdminInfo] = useState(
        JSON.parse(localStorage.getItem("user")) || {} // Initialize from localStorage
    );

    // Log in the user and store token and user info
    const loginAdmin = async (email, password) => {
        const client = new APIClient('user/login')
        const response = await client.authenticate({ email, password, role: "admin" });
        if (response.data.success) {
            setToken(response.data.token);
            setAdminInfo(response.data.user);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        return response.data;
    };
    
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(adminInfo));
    }, [adminInfo]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }, [token]);

    const contextValue = {
        token,
        setToken,
        loginAdmin,
        adminInfo,
        setAdminInfo,
        url,

    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
