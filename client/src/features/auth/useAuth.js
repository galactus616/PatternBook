import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser, googleLogin } from "./auth.api";
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

  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: (res) => {
      if (res.success) {
        setAuth(res.data.user, res.data.token);
      }
    },
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
    googleLogin: googleLoginMutation.mutateAsync,
    logout,
    resetErrors: () => {
      loginMutation.reset();
      registerMutation.reset();
      googleLoginMutation.reset();
    },
    isLoading: loginMutation.isPending || registerMutation.isPending || googleLoginMutation.isPending,
    error: loginMutation.error || registerMutation.error || googleLoginMutation.error,
  };
};