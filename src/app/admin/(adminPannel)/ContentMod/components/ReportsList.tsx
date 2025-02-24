"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReports } from '../hooks/useReports';
import { useReportActions } from '../hooks/useReportActions';
import { ReportCard } from './ReportCard';

type StatusType = 'all' | 'pending' | 'reviewed' | 'ignored' | 'action_taken';

export const ReportsList: React.FC = () => {
  const { consolidatedReports, filters, setFilters, fetchReports } = useReports();
  const { handleToggleVisibility, handleReportAction } = useReportActions(fetchReports);

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
          {consolidatedReports.map((report) => (
            <ReportCard
              key={report.postId._id}
              report={report}
              onToggleVisibility={handleToggleVisibility}
              onIgnoreReport={handleReportAction}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};