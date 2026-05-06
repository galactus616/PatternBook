import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "./auth.api";
import { useAuthStore } from "../../store/useAuthStore";

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      if (res.success) {
        setAuth(res.data.user, res.data.token);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
  });

  const logout = () => {
    clearAuth();
  };

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
};