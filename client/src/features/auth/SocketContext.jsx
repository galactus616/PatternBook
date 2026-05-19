import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./useAuth";
import io from "socket.io-client";
import { useNotificationStore } from "../../store/useNotificationStore";
import { useToastStore } from "../../store/useToastStore";
import { useQueryClient } from "@tanstack/react-query";

const SocketContext = createContext();

const getSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/v1";
    return apiUrl.replace(/\/v1\/?$/, "");
};

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (user) {
            const socket = io(getSocketUrl(), {
                query: {
                    userId: user.id,
                },
            });

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            socket.on("newNotification", (notification) => {
                useNotificationStore.getState().addNotification(notification);
                useToastStore.getState().addToast(notification.message, "success");
            });

            socket.on("newFriendRequest", (newRequest) => {
                queryClient.setQueryData(["pendingRequests"], (old) => [newRequest, ...(old || [])]);
            });

            socket.on("friendRequestAccepted", ({ requestId, user: senderUser }) => {
                queryClient.setQueryData(["friends"], (old) => [...(old || []), senderUser]);
                queryClient.invalidateQueries({ queryKey: ["userSearch"] });
                queryClient.invalidateQueries({ queryKey: ["friends"] });
                queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
            });

            socket.on("friendRemoved", ({ requestId }) => {
                queryClient.setQueryData(["friends"], (old) => old?.filter(f => f.id !== requestId && f.friendshipId !== requestId));
                queryClient.invalidateQueries({ queryKey: ["friends"] });
            });

            return () => {
                socket.off("getOnlineUsers");
                socket.off("newNotification");
                socket.off("newFriendRequest");
                socket.off("friendRequestAccepted");
                socket.off("friendRemoved");
                socket.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user, queryClient]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
