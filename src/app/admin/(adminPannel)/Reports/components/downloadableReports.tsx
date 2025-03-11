"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reportService, ReportOptions, ReportType, ReportTimeframe, ReportFormat } from '../services/index';
import { toast } from 'sonner';

const DownloadableReports = () => {
  const [reportType, setReportType] = useState<ReportType>("userGrowth");
  const [timeframe, setTimeframe] = useState<ReportTimeframe>("lastMonth");
  const [reportFormat, setReportFormat] = useState<ReportFormat>("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showCustomDates, setShowCustomDates] = useState(false);
  
  useEffect(() => {
    setShowCustomDates(timeframe === 'custom');
  }, [timeframe]);
  
  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      // Prepare report options
      const options: ReportOptions = {
        reportType,
        timeframe,
        format: reportFormat
      };
      
      // Add date range for custom timeframe
      if (timeframe === 'custom') {
        if (!startDate || !endDate) {
          toast.error("Please select start and end dates for custom timeframe");
          setIsGenerating(false);
          return;
        }
        options.startDate = startDate;
        options.endDate = endDate;
      }
      
      // Generate report
      const fileBlob = await reportService.generateReport(options);
      
      // Create a URL directly from the received blob without wrapping it in a new Blob
      const url = URL.createObjectURL(fileBlob);
      
      // Generate appropriate filename
      const filename = `${reportType}-${timeframe}.${reportFormat}`;
      
      // Download the file
      reportService.downloadFile(url, filename);
      
      toast.success("Report generated successfully");
    } catch (error) {
      console.error(error)
      // Error handling remains the same
    } finally {
      setIsGenerating(false);
    }
  };
  
  const reportTypes = [
    { value: "userGrowth", label: "User Growth" },
    { value: "revenue", label: "Revenue" },
  ];
  
  const timeframes = [
    { value: "lastWeek", label: "Last 7 Days" },
    { value: "lastMonth", label: "Last 30 Days" },
    { value: "lastQuarter", label: "Last Quarter" },
    { value: "ytd", label: "Year to Date" },
    { value: "custom", label: "Custom Range" },
  ];
  
  const formats = [
    { value: "pdf", label: "PDF" },
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Downloadable Reports
        </CardTitle>
        <CardDescription>
          Generate and download detailed reports for data analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={timeframe} onValueChange={(value) => setTimeframe(value as ReportTimeframe)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={reportFormat} onValueChange={(value) => setReportFormat(value as ReportFormat)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {showCustomDates && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <Button 
            className="w-full sm:w-auto" 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>Generating<span className="loading loading-dots ml-2"></span></>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Generate Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadableReports;