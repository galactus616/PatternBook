import { create } from 'zustand';
import axios from '../lib/axios';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  
  fetchNotifications: async () => {
    try {
      const res = await axios.get('/notifications');
      if (res.data.success) {
        set({
          notifications: res.data.data,
          unreadCount: res.data.data.filter(n => !n.isRead).length
        });
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  },

  addNotification: (notification) => {
    set((state) => {
      const exists = state.notifications.some(n => n.id === notification.id);
      if (exists) return state;

      const updated = [notification, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter(n => !n.isRead).length
      };
    });
  },

  markAsRead: async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      set((state) => {
        const updated = state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.isRead).length
        };
      });
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  },

  markAllAsRead: async () => {
    try {
      await axios.put(`/notifications/read-all`);
      set((state) => {
        const updated = state.notifications.map(n => ({ ...n, isRead: true }));
        return {
          notifications: updated,
          unreadCount: 0
        };
      });
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  },

  deleteNotification: async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      set((state) => {
        const updated = state.notifications.filter(n => n.id !== id);
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.isRead).length
        };
      });
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  }
}));
