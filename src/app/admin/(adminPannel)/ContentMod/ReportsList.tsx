'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '../../lib/axios-config';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';

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

interface ConsolidatedReport {
  postId: Post;
  reports: Report[];
  totalReports: number;
  uniqueReasons: string[];
}

interface Filters {
  status: string;
  page: number;
  limit: number;
}

type StatusType = 'all' | 'pending' | 'reviewed' | 'ignored' | 'action_taken';

export const ReportsList: React.FC = () => {
  const [consolidatedReports, setConsolidatedReports] = useState<ConsolidatedReport[]>([]);
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
      
      // Consolidate reports by postId
      const consolidatedMap = new Map<string, ConsolidatedReport>();
      
      response.data.data.forEach(report => {
        const postId = report.postId._id;
        
        if (!consolidatedMap.has(postId)) {
          consolidatedMap.set(postId, {
            postId: report.postId,
            reports: [report],
            totalReports: 1,
            uniqueReasons: [report.reason]
          });
        } else {
          const existingReport = consolidatedMap.get(postId)!;
          existingReport.reports.push(report);
          existingReport.totalReports++;
          
          // Add unique reasons
          if (!existingReport.uniqueReasons.includes(report.reason)) {
            existingReport.uniqueReasons.push(report.reason);
          }
        }
      });

      setConsolidatedReports(Array.from(consolidatedMap.values()));
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch reports');
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [filters, fetchReports]);

  const handleToggleVisibility = async (postId: string, currentPost: Post): Promise<void> => {
    try {
      const newIsDeletedStatus = !currentPost.isDeleted;
      const response = newIsDeletedStatus ? 'Post hidden from public view' : 'Post restored and made visible to users';
      
      // Use the first report's ID for the action
      const firstReportId = consolidatedReports
        .find(cr => cr.postId._id === postId)?.reports[0]._id;
      
      await api.post(`api/admin/reports/${firstReportId}/action`, {
        action: 'TOGGLE_POST',
        response,
        isDeleted: newIsDeletedStatus
      });
      
      await fetchReports();
      toast.success(`Post ${newIsDeletedStatus ? 'hidden' : 'restored'} successfully`);
    } catch (error) {
      console.error(error)
      toast.error('Failed to update post visibility');
    }
  };

  const handleReportAction = async (postId: string, currentPost: Post): Promise<void> => {
    try {
      // Use the first report's ID for the action
      const firstReportId = consolidatedReports
        .find(cr => cr.postId._id === postId)?.reports[0]._id;
      
      await api.post(`api/admin/reports/${firstReportId}/action`, {
        action: 'IGNORE',
        response: 'No violation found - report ignored',
        isDeleted: currentPost.isDeleted
      });
      
      await fetchReports();
      toast.success('Report ignored successfully');
    } catch (error) {
      console.error(error)
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
          {consolidatedReports.map((consolidatedReport) => (
            <div key={consolidatedReport.postId._id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Reported Content</h3>
                    <div className="flex items-center">
                      <Badge 
                        variant="destructive" 
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full"
                      >
                        <span className="font-bold mr-1">{consolidatedReport.totalReports}</span>
                        Report{consolidatedReport.totalReports !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className={consolidatedReport.postId.isDeleted ? "text-gray-400 mt-2" : "mt-2"}>
                    {consolidatedReport.postId.text}
                  </p>
                </div>
                <span className="text-sm text-gray-400">
                  {format(new Date(consolidatedReport.reports[0].timestamp), 'PPp')}
                </span>
              </div>
              
              {consolidatedReport.postId.media && consolidatedReport.postId.media.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {consolidatedReport.postId.media.map((mediaItem) => (
                    <img 
                      key={mediaItem._id}
                      src={mediaItem.url} 
                      alt={`${mediaItem.type} content`}
                      className={`max-h-40 rounded object-cover w-full ${consolidatedReport.postId.isDeleted ? "opacity-50" : ""}`}
                    />
                  ))}
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium mb-2">Report Reasons</h4>
                <div className="space-y-2">
                  {consolidatedReport.uniqueReasons.map((reason, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  variant={consolidatedReport.postId.isDeleted ? "outline" : "destructive"}
                  onClick={() => handleToggleVisibility(consolidatedReport.postId._id, consolidatedReport.postId)}
                >
                  {consolidatedReport.postId.isDeleted ? 'Restore Post' : 'Hide Post'}
                </Button>
                
                {consolidatedReport.reports.some(r => r.status === 'pending') && (
                  <Button
                    variant="ghost"
                    onClick={() => handleReportAction(consolidatedReport.postId._id, consolidatedReport.postId)}
                  >
                    Ignore Report
                  </Button>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-500">
                <p>
                  <span className="font-medium">Reported By:</span>{' '}
                  <span className="flex items-center gap-2">
                    {consolidatedReport.reports.slice(0, 3).map((report) => (
                       <div key={report.reportedBy._id} className="flex items-center gap-2">
                       <Avatar className="h-6 w-6">
                         <AvatarImage src={report.reportedBy.profile.profilePicture} />
                       </Avatar>
                       <div>
                         <span className="font-medium">{report.reportedBy.email.split('@')[0]}</span>
                       </div>
                     </div>
                    ))}
                    {consolidatedReport.reports.length > 3 && (
                      <span className="text-gray-500">
                        +{consolidatedReport.reports.length - 3} more
                      </span>
                    )}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};