'use client';

import React, { useEffect, useState } from 'react';
import { Notification, useNotifications } from '@/lib/hooks/useNotifications';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface NotificationSystemProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  position = 'top-right',
  maxNotifications = 5
}) => {
  const { notifications, removeNotification } = useNotifications();
  const [displayNotifications, setDisplayNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setDisplayNotifications(notifications.slice(0, maxNotifications));
  }, [notifications, maxNotifications]);

  const getIcon = (type: Notification['type']) => {
    const iconClass = 'w-6 h-6';
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      case 'error':
        return <ExclamationCircleIcon className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-500`} />;
      case 'info':
        return <InformationCircleIcon className={`${iconClass} text-blue-500`} />;
    }
  };

  const getStyles = (type: Notification['type']) => {
    const baseStyles = 'transform transition-all duration-300 ease-in-out';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-200`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200`;
    }
  };

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[position];
  };

  if (displayNotifications.length === 0) return null;

  return (
    <div className={`fixed z-50 ${getPositionClasses()} space-y-2`}>
      {displayNotifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          index={index}
          onRemove={() => removeNotification(notification.id)}
          getIcon={getIcon}
          getStyles={getStyles}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  index: number;
  onRemove: () => void;
  getIcon: (type: Notification['type']) => React.ReactNode;
  getStyles: (type: Notification['type']) => string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  index,
  onRemove,
  getIcon,
  getStyles
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(onRemove, 300); // Wait for exit animation
  };

  return (
    <div
      className={`
        ${getStyles(notification.type)}
        border rounded-lg shadow-lg p-4 min-w-80 max-w-md
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3 space-x-reverse">
        {getIcon(notification.type)}
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold mb-1">
            {notification.title}
          </h4>
          {notification.message && (
            <p className="text-sm opacity-90">
              {notification.message}
            </p>
          )}
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50 rounded"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {notification.dismissible !== false && (
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="إغلاق الإشعار"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;