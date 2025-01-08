'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '../../lib/axios-config';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface MediaItem {
  type: string;
  url: string;
  _id: string;
}

interface Profile {
  profilePicture: string;
}

interface Reporter {
  _id: string;
  email: string;
  profile: Profile;
}

interface Post {
  _id: string;
  text: string;
  media?: MediaItem[];
  isDeleted: boolean;
}

interface Report {
  _id: string;
  reason: string;
  details?: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'ignored' | 'action_taken';
  postId: Post;
  reportedBy: Reporter;
  adminResponse?: string;
}

interface Filters {
  status: string;
  page: number;
  limit: number;
}

type StatusType = 'all' | 'pending' | 'reviewed' | 'ignored' | 'action_taken';

export const ReportsList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    page: 1,
    limit: 10
  });

  const fetchReports = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get<{ data: Report[] }>('api/admin/reports', {
        params: filters
      });
      setReports(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [filters, fetchReports]);

  const handleToggleVisibility = async (reportId: string, currentPost: Post): Promise<void> => {
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
      toast.error('Failed to update post visibility');
    }
  };

  const handleReportAction = async (reportId: string, currentPost: Post): Promise<void> => {
    try {
      await api.post(`api/admin/reports/${reportId}/action`, {
        action: 'IGNORE',
        response: 'No violation found - report ignored',
        isDeleted: currentPost.isDeleted
      });
      await fetchReports();
      toast.success('Report ignored successfully');
    } catch (error) {
      toast.error('Failed to ignore report');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Moderation Reports</CardTitle>
        <div className="flex gap-4">
          <Select
            value={filters.status}
            onValueChange={(value: StatusType) => setFilters(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="ignored">Ignored</SelectItem>
              <SelectItem value="action_taken">Action Taken</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Report #{report._id}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={report.reportedBy.profile.profilePicture} />
                    </Avatar>
                    <span className="text-sm text-gray-600">{report.reportedBy.email}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{report.reason}</p>
                  {report.details && (
                    <p className="text-sm text-gray-500 mt-1">{report.details}</p>
                  )}
                </div>
                <span className="text-sm text-gray-400">
                  {format(new Date(report.timestamp), 'PPp')}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Reported Content</h4>
                  {report.postId.isDeleted && (
                    <span className="text-sm text-red-500 font-medium">Currently Hidden</span>
                  )}
                </div>
                <p className={report.postId.isDeleted ? "text-gray-400" : ""}>
                  {report.postId.text}
                </p>
                {report.postId.media && report.postId.media.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {report.postId.media.map((mediaItem) => (
                      <img 
                        key={mediaItem._id}
                        src={mediaItem.url} 
                        alt={`${mediaItem.type} content`}
                        className={`max-h-40 rounded object-cover w-full ${report.postId.isDeleted ? "opacity-50" : ""}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  variant={report.postId.isDeleted ? "outline" : "destructive"}
                  onClick={() => handleToggleVisibility(report._id, report.postId)}
                >
                  {report.postId.isDeleted ? 'Restore Post' : 'Hide Post'}
                </Button>
                
                {report.status === 'pending' && (
                  <Button
                    variant="ghost"
                    onClick={() => handleReportAction(report._id, report.postId)}
                  >
                    Ignore Report
                  </Button>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-500">
                <p><span className="font-medium">Status:</span> {report.status}</p>
                {report.adminResponse && (
                  <p className="mt-1">
                    <span className="font-medium">Admin Response:</span> {report.adminResponse}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};