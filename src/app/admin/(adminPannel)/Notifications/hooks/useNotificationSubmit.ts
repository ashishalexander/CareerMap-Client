"use client"
import { useState } from "react";
import { NotificationFormData } from "../schema/Notification";
import api, { ApiError } from "../../../lib/axios-config";

 export const useNotificationSubmit = () => {
  const [loading, setLoading] = useState(false);
  
  const sendNotification = async (formData: NotificationFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        link: formData.link || undefined
      };
      await api.post('/api/admin/notifications/create', payload);
      return { success: true, message: "Notification sent successfully!" };
    } catch (error) {
      const message = error instanceof ApiError 
        ? `Error sending notification: ${error.message}`
        : 'An unexpected error occurred';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendNotification };

};