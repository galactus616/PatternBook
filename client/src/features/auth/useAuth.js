import { useState, useEffect } from "react";

export const useAuth = () => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (stored) setToken(stored);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return {
        token,
        isAuthenticated: !!token,
        login,
        logout,
    };
};