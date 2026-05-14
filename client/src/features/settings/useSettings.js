import { useMutation, useQuery } from "@tanstack/react-query";
import {
  updateProfile,
  getPaymentHistory,
  exportData,
  resetProgress,
  deleteAccount,
} from "./settings.api";
import { useAuthStore } from "../../store/useAuthStore";

export const useUpdateProfile = () => {
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      if (res.success) {
        updateUser(res.data);
      }
    },
  });
};

export const usePaymentHistory = () => {
  return useQuery({
    queryKey: ["paymentHistory"],
    queryFn: getPaymentHistory,
  });
};

export const useExportData = () => {
  return useMutation({
    mutationFn: exportData,
  });
};

export const useResetProgress = () => {
  return useMutation({
    mutationFn: resetProgress,
  });
};

export const useDeleteAccount = () => {
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearAuth();
      window.location.href = "/";
    },
  });
};