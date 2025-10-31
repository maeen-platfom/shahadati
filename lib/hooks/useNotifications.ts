import { useState, useCallback, useRef, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showSuccess: (title: string, message?: string) => string;
  showError: (title: string, message?: string) => string;
  showWarning: (title: string, message?: string) => string;
  showInfo: (title: string, message?: string) => string;
}

let globalNotifications: Notification[] = [];
let globalListeners: ((notifications: Notification[]) => void)[] = [];

const generateId = () => Math.random().toString(36).substr(2, 9);

const notifyListeners = () => {
  globalListeners.forEach(listener => listener([...globalNotifications]));
};

export const useNotifications = (): NotificationContextType => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>): string => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? 5000,
    };

    globalNotifications = [newNotification, ...globalNotifications];
    setNotifications([...globalNotifications]);
    notifyListeners();

    // Auto dismiss after duration
    if (newNotification.duration && newNotification.duration > 0) {
      const timer = setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
      timersRef.current.set(id, timer);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    // Clear timer if exists
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    globalNotifications = globalNotifications.filter(n => n.id !== id);
    setNotifications([...globalNotifications]);
    notifyListeners();
  }, []);

  const clearAll = useCallback(() => {
    // Clear all timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();

    globalNotifications = [];
    setNotifications([]);
    notifyListeners();
  }, []);

  const showSuccess = useCallback((title: string, message?: string): string => {
    return addNotification({ type: 'success', title, message });
  }, [addNotification]);

  const showError = useCallback((title: string, message?: string): string => {
    return addNotification({ 
      type: 'error', 
      title, 
      message,
      duration: 8000 // Errors stay longer
    });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message?: string): string => {
    return addNotification({ 
      type: 'warning', 
      title, 
      message,
      duration: 6000
    });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message?: string): string => {
    return addNotification({ type: 'info', title, message });
  }, [addNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

// Cross-component notification system
export const addGlobalNotification = (notification: Omit<Notification, 'id' | 'timestamp'>): string => {
  const id = generateId();
  const newNotification: Notification = {
    ...notification,
    id,
    timestamp: Date.now(),
    duration: notification.duration ?? 5000,
  };

  globalNotifications = [newNotification, ...globalNotifications];
  notifyListeners();

  // Auto dismiss after duration
  if (newNotification.duration && newNotification.duration > 0) {
    setTimeout(() => {
      globalNotifications = globalNotifications.filter(n => n.id !== id);
      notifyListeners();
    }, newNotification.duration);
  }

  return id;
};

export const subscribeToNotifications = (listener: (notifications: Notification[]) => void) => {
  globalListeners.push(listener);
  return () => {
    globalListeners = globalListeners.filter(l => l !== listener);
  };
};