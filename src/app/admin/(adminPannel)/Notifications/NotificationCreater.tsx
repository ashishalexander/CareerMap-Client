"use client"
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError } from '../../lib/axios-config';

interface NotificationPayload {
  title: string;
  message: string;
  link?: string;
}

interface NotificationResponse {
  id: string;
  createdAt: string;
  status: 'SENT' | 'FAILED';
}

const AdminNotificationCreator: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const payload: NotificationPayload = {
        title,
        message,
        ...(link && { link })
      };

      const response = await api.post<NotificationResponse>(
        '/api/admin/notifications/create',
        payload
      );

      // Reset form
      setTitle('');
      setMessage('');
      setLink('');
      setNotification({ type: 'success', message: 'Notification sent successfully!' });
    } catch (error) {
      if (error instanceof ApiError) {
        setNotification({ type: 'error', message: `Error sending notification: ${error.message}` });
      } else {
        setNotification({ type: 'error', message: 'An unexpected error occurred' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create Notification</CardTitle>
      </CardHeader>
      <CardContent>
        {notification && (
          <Alert variant={notification.type === 'success' ? 'default' : 'destructive'} className="mb-6">
            <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link (Optional)</Label>
              <Input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/relevant-page"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your notification message"
              required
              className="h-32"
            />
            <p className="text-sm text-muted-foreground text-right">
              {message.length}/500 characters
            </p>
          </div>
          <div className="transition-transform duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <div
                    className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminNotificationCreator;

