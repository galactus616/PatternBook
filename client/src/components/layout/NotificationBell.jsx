import React, { useEffect, useRef, useState } from 'react';
import { Bell, Check, Trash2, UserPlus, HeartHandshake, Zap, Sparkles } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const NotificationBell = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'WELCOME':
        return <Zap size={16} className="text-lime" />;
      case 'FRIEND_REQUEST_RECEIVED':
        return <UserPlus size={16} className="text-brand-red" />;
      case 'FRIEND_REQUEST_ACCEPTED':
        return <HeartHandshake size={16} className="text-lime" />;
      case 'PRO_UPGRADE':
        return <Sparkles size={16} className="text-amber-500" />;
      default:
        return <Bell size={16} className="text-muted" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted hover:text-ink hover:bg-cream-dark rounded-full transition-all cursor-pointer relative"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] flex items-center justify-center bg-brand-red rounded-full border-2 border-cream text-white text-[8px] font-bold px-0.5">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
 
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] bg-white border border-rule rounded-[8px] z-50 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-rule bg-faint/30">
            <h3 className="font-bold text-[13px] text-ink">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                className="text-[11px] text-brand-red hover:underline font-medium cursor-pointer flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted text-[12px]">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    if (!notif.isRead) markAsRead(notif.id);
                    setIsOpen(false);
                    if (notif.type === 'WELCOME') {
                      navigate('/problems');
                    } else if (notif.type === 'FRIEND_REQUEST_RECEIVED' || notif.type === 'FRIEND_REQUEST_ACCEPTED') {
                      navigate('/friends');
                    } else if (notif.type === 'PRO_UPGRADE') {
                      navigate('/settings?tab=subscription');
                    }
                  }}
                  className={`px-4 py-3 border-b border-rule last:border-b-0 hover:bg-cream/50 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-cream-dark/40' : ''}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] leading-tight ${!notif.isRead ? 'text-ink font-semibold' : 'text-muted-dark'}`}>
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-muted block mt-1">
                      {dayjs(notif.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-1.5 text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-full transition-colors cursor-pointer opacity-0 group-hover:opacity-100 sm:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
