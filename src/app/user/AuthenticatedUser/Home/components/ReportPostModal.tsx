import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import api from '../../../../lib/axios-config';

const REPORT_REASONS = [
  { id: 'inappropriate', label: 'Inappropriate Content' },
  { id: 'harassment', label: 'Harassment or Bullying' },
  { id: 'spam', label: 'Spam or Misleading' },
  { id: 'hate_speech', label: 'Hate Speech' },
  { id: 'violence', label: 'Violence or Dangerous Content' },
  { id: 'copyright', label: 'Copyright Violation' },
  { id: 'other', label: 'Other' }
];


interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  userId: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, postId, userId }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const reportMutation = useMutation({
    mutationFn: async ({ postId, userId, reason, details }: {
      postId: string;
      userId: string;
      reason: string;
      details: string;
    }) => {
      const response = await api.post('/api/users/posts/report', {
        postId,
        userId,
        reason,
        details,
        timestamp: new Date().toISOString()
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.blocked) {
        // Post was automatically blocked due to reaching threshold
        // You might want to update the UI or trigger a refresh
      }
      onClose();
      setReason('');
      setDetails('');
      setError('');
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to submit report. Please try again.');
    }
  });

  const handleSubmit = () => {
    if (!reason) {
      setError('Please select a reason for reporting');
      return;
    }

    reportMutation.mutate({ postId, userId, reason, details });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Report Post</AlertDialogTitle>
          <AlertDialogDescription>
            Help us understand why you want to report this post. Your report will be reviewed by our moderation team.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 my-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            {REPORT_REASONS.map((reportReason) => (
              <div key={reportReason.id} className="flex items-center space-x-2">
                <RadioGroupItem value={reportReason.id} id={reportReason.id} />
                <Label htmlFor={reportReason.id}>{reportReason.label}</Label>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              id="details"
              placeholder="Please provide any additional context..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={reportMutation.isPending}
          >
            {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};