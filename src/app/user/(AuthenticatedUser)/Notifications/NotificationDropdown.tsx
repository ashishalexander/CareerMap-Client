// src/components/notifications/NotificationDropdown.tsx
import React, { useState } from 'react';
import { NotificationIcon } from './NotificationIcon';

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
        </>
      )}
    </div>
  );
};