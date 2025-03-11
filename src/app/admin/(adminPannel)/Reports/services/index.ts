// api/reportService.ts
import api, { ApiError } from '../../../lib/axios-config';

export type ReportTimeframe = 'lastWeek' | 'lastMonth' | 'lastQuarter' | 'ytd' | 'custom';
export type ReportType = 'userGrowth'  | 'revenue';
export type ReportFormat =  'pdf';

export interface ReportOptions {
  reportType: ReportType;
  timeframe: ReportTimeframe;
  format: ReportFormat;
  startDate?: string; 
  endDate?: string; 
}

class ReportService {
  /**
   * Generate a new report with specified options and return it as a blob
   */
  async generateReport(options: ReportOptions): Promise<Blob> {
    try {
      // Send the request with correct headers and response type
      const response = await api.post('/api/admin/reports/generate', options, {
        responseType: 'blob',
        headers: {
          'Accept': '*/*',  // Accept any response type
          'Content-Type': 'application/json'
        }
      });
      
      // Return the response data directly if it's already a Blob
      if (response instanceof Blob) {
        return response;
      }
      
      // If the response has data property and it's a Blob
      if (response.data instanceof Blob) {
        return response.data;
      }
      
      // Handle the case where response is in a different format
      const data = response.data || response;
      
      const contentType =  'application/pdf' 
      return new Blob([data], { type: contentType });
    } catch (error) {
      console.error('Error generating report:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to generate report');
    }
  }  
  /**
   * Download file from blob URL
   */
  downloadFile(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}

export const reportService = new ReportService();