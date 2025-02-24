import React from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NotificationFormData } from '../schema/Notification';

interface NotificationFormProps {
  formData: NotificationFormData;
  errors: Partial<Record<keyof NotificationFormData, string>>;
  loading: boolean;
  onFieldChange: (field: keyof NotificationFormData, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
  formData,
  errors,
  loading,
  onFieldChange,
  onSubmit
}) => (
  <form onSubmit={onSubmit} className="space-y-6 p-4">
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
          placeholder="Notification title"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="link">Link (Optional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => onFieldChange('link', e.target.value)}
          placeholder="https://example.com/relevant-page"
          className={errors.link ? "border-red-500" : ""}
        />
        {errors.link && (
          <p className="text-sm text-red-500">{errors.link}</p>
        )}
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="message">Message</Label>
      <Textarea
        id="message"
        value={formData.message}
        onChange={(e) => onFieldChange('message', e.target.value)}
        placeholder="Enter your notification message"
        className={`h-32 ${errors.message ? "border-red-500" : ""}`}
      />
      <div className="flex justify-between">
        <p className="text-sm text-red-500">{errors.message}</p>
        <p className="text-sm text-muted-foreground">
          {formData.message.length}/500 characters
        </p>
      </div>
    </div>
    <Button
      type="submit"
      disabled={loading}
      className="w-full transition-transform duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
    >
      {loading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send Notification
        </>
      )}
    </Button>
  </form>
);