// components/JobMarketMetrics.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { jobMetricsService } from '../api/metricService';
import { JobMetrics } from '../Types/metrics';

const JobMarketMetrics = () => {
  const [metrics, setMetrics] = useState<JobMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await jobMetricsService.getJobMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load job metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!metrics) return null;

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Job Market Overview</CardTitle>
          <CardDescription>Current job statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>Total Jobs: {metrics.totalJobs}</div>
          <div>Active Jobs: {metrics.activeJobs}</div>
          <div>Completed Jobs: {metrics.completedJobs}</div>
          <div>Success Rate: {metrics.jobSuccessRate.toFixed(1)}%</div>
          <div>Avg Completion Time: {formatTime(metrics.averageCompletionTime)}</div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Job Posting Trends</CardTitle>
          <CardDescription>Monthly job posting activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.jobPostingTrends}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="postings" fill="#8884d8" name="Job Postings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Job Type Distribution</CardTitle>
          <CardDescription>Distribution of jobs by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.jobTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.jobTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobMarketMetrics;