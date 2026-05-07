import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

export const Providers = ({ children }) => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
};