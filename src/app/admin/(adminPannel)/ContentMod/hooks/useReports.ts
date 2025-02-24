import { useState, useCallback, useEffect } from 'react';
import api from '../../../lib/axios-config';
import { toast } from 'sonner';
import { ConsolidatedReport, Report, Filters } from '../Types/index';

export const useReports = () => {
  const [consolidatedReports, setConsolidatedReports] = useState<ConsolidatedReport[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    page: 1,
    limit: 10
  });

  const consolidateReports = (reports: Report[]): ConsolidatedReport[] => {
    const consolidatedMap = new Map<string, ConsolidatedReport>();
    
    reports.forEach(report => {
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
        
        if (!existingReport.uniqueReasons.includes(report.reason)) {
          existingReport.uniqueReasons.push(report.reason);
        }
      }
    });

    return Array.from(consolidatedMap.values());
  };

  const fetchReports = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get<{ data: Report[] }>('api/admin/reports', {
        params: filters
      });
      setConsolidatedReports(consolidateReports(response.data.data));
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch reports');
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [filters, fetchReports]);

  return {
    consolidatedReports,
    filters,
    setFilters,
    fetchReports
  };
};