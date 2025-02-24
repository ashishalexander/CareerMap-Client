"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NotificationForm } from './components/NotificationForm';
import {  toast } from 'sonner';
import  {useNotificationForm}  from './hooks/useNotificationForm';
import { useNotificationSubmit } from './hooks/useNotificationSubmit';

const NotificationCreator: React.FC = () => {
  const { formData, errors, updateField, validateForm, resetForm } = useNotificationForm();
  const { loading, sendNotification } = useNotificationSubmit();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const result = await sendNotification(formData);
    if (result.success) {
      toast.success(result.message);
      resetForm();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Create Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationForm
            formData={formData}
            errors={errors}
            loading={loading}
            onFieldChange={updateField}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default NotificationCreator;