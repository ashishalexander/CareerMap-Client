import React from 'react';
import NotificationHandler from './NotificationHandler';

export const NotificationWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NotificationHandler />
      {children}
    </>
  );
};