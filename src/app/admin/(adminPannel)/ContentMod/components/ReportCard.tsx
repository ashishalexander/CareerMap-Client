import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConsolidatedReport, Post } from '../Types/index';
import { ReportMediaGallery } from './ReportMediaGallery';
import { ReportReasons } from './ReportReasons';
import { ReportersList } from './ReportersList';

interface ReportCardProps {
  report: ConsolidatedReport;
  onToggleVisibility: (reportId: string, post: Post) => Promise<void>;
  onIgnoreReport: (reportId: string, post: Post) => Promise<void>;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onToggleVisibility,
  onIgnoreReport
}) => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="flex justify-between items-start">
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Reported Content</h3>
          <Badge 
            variant="destructive" 
            className="bg-red-100 text-red-700 px-3 py-1 rounded-full"
          >
            <span className="font-bold mr-1">{report.totalReports}</span>
            Report{report.totalReports !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <p className={report.postId.isDeleted ? "text-gray-400 mt-2" : "mt-2"}>
          {report.postId.text}
        </p>
      </div>
      <span className="text-sm text-gray-400">
        {format(new Date(report.reports[0].timestamp), 'PPp')}
      </span>
    </div>
    
    {report.postId.media && report.postId.media.length > 0 && (
      <ReportMediaGallery 
        media={report.postId.media} 
        isDeleted={report.postId.isDeleted} 
      />
    )}

    <ReportReasons reasons={report.uniqueReasons} />

    <div className="flex gap-2 mt-3">
      <Button
        variant={report.postId.isDeleted ? "outline" : "destructive"}
        onClick={() => onToggleVisibility(report.reports[0]._id, report.postId)}
      >
        {report.postId.isDeleted ? 'Restore Post' : 'Hide Post'}
      </Button>
      
      {report.reports.some(r => r.status === 'pending') && (
        <Button
          variant="ghost"
          onClick={() => onIgnoreReport(report.reports[0]._id, report.postId)}
        >
          Ignore Report
        </Button>
      )}
    </div>

    <ReportersList reporters={report.reports.map(r => r.reportedBy)} />
  </div>
);
