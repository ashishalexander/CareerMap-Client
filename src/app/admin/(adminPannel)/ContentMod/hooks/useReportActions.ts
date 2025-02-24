import { useCallback } from 'react';
import api from '../../../lib/axios-config';
import { toast } from 'sonner';
import { Post } from '../Types/index';

export const useReportActions = (fetchReports: () => Promise<void>) => {
  const handleToggleVisibility = useCallback(async (reportId: string, currentPost: Post): Promise<void> => {
    try {
      const newIsDeletedStatus = !currentPost.isDeleted;
      const response = newIsDeletedStatus ? 'Post hidden from public view' : 'Post restored and made visible to users';
      
      await api.post(`api/admin/reports/${reportId}/action`, {
        action: 'TOGGLE_POST',
        response,
        isDeleted: newIsDeletedStatus
      });
      
      await fetchReports();
      toast.success(`Post ${newIsDeletedStatus ? 'hidden' : 'restored'} successfully`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update post visibility');
    }
  }, [fetchReports]);

  const handleReportAction = useCallback(async (reportId: string, currentPost: Post): Promise<void> => {
    try {
      await api.post(`api/admin/reports/${reportId}/action`, {
        action: 'IGNORE',
        response: 'No violation found - report ignored',
        isDeleted: currentPost.isDeleted
      });
      
      await fetchReports();
      toast.success('Report ignored successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to ignore report');
    }
  }, [fetchReports]);

  return {
    handleToggleVisibility,
    handleReportAction
  };
};