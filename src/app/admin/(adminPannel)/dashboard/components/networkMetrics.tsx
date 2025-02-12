import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { networkMetricsService } from '../api/metricService';

interface ConnectionActivity {
  month: string;
  connections: number;
  requestsSent: number;
  requestsReceived: number;
}

interface ConnectionStatus {
  name: string;
  value: number;
}

interface NetworkMetricsData {
  connectionActivity: ConnectionActivity[];
  connectionStatus: ConnectionStatus[];
}

const NetworkActivityMetrics = () => {
  const [networkData, setNetworkData] = useState<NetworkMetricsData>({
    connectionActivity: [],
    connectionStatus: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  useEffect(() => {
    const fetchNetworkMetrics = async () => {
      try {
        setLoading(true);
        const response = await networkMetricsService.getNetworkMetrics();
        
        // Transform the date format for better display
        const transformedActivity = response.connectionActivity.map(item => ({
          ...item,
          month: new Date(item.month + '-01').toLocaleString('default', { month: 'short' })
        }));

        setNetworkData({
          connectionActivity: transformedActivity,
          connectionStatus: response.connectionStatus
        });
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching network metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkMetrics();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px]">
            Loading network metrics...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px] text-red-500">
            Error loading network metrics: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Network Activity Metrics</CardTitle>
        <CardDescription>Monitor connection growth and networking patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={networkData.connectionActivity}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="connections" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Active Connections"
              />
              <Area 
                type="monotone" 
                dataKey="requestsSent" 
                stackId="2"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Requests Sent"
              />
              <Area 
                type="monotone" 
                dataKey="requestsReceived" 
                stackId="3"
                stroke="#ffc658" 
                fill="#ffc658" 
                name="Requests Received"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={networkData.connectionStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {networkData.connectionStatus.map((entry, index) => (
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
  );
};

export default NetworkActivityMetrics;