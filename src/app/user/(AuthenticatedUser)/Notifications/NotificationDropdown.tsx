// src/components/notifications/NotificationDropdown.tsx
import React, { useState } from 'react';
import { NotificationIcon } from './NotificationIcon';
import { NotificationList } from './NotificationList';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        <NotificationIcon />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            <NotificationList />
          </div>
        </>
      )}
    </div>
  );
};