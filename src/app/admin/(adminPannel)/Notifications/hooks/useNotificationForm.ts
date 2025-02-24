"use client"
import { useState } from "react";
import { notificationSchema, NotificationFormData } from "../schema/Notification";
import { z } from "zod";

type FormErrors = Partial<Record<keyof NotificationFormData, string>>;

export const useNotificationForm = () => {
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    message: "",
    link: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (field: keyof NotificationFormData, value: string) => {
    try {
      notificationSchema.shape[field].parse(value);
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
      }
      return false;
    }
  };

  const updateField = (field: keyof NotificationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateForm = () => {
    const result = notificationSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach(error => {
        const path = error.path[0];
        if (typeof path === 'string' && path in formData) {
          newErrors[path as keyof NotificationFormData] = error.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm: () => {
      setFormData({ title: "", message: "", link: "" });
      setErrors({});
    }
  };

};