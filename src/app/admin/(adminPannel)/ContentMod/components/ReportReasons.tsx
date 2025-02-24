import React from 'react';

interface ReportReasonsProps {
  reasons: string[];
}

export const ReportReasons: React.FC<ReportReasonsProps> = ({ reasons }) => (
  <div className="bg-gray-50 p-3 rounded">
    <h4 className="font-medium mb-2">Report Reasons</h4>
    <div className="space-y-2">
      {reasons.map((reason, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">{reason}</span>
        </div>
      ))}
    </div>
  </div>
);