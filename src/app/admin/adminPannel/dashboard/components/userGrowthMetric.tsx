import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userGrowthMetricsService } from '../api/metricService';
import { UserGrowthMetrics as UserGrowthMetricsType } from '../Types/metrics';

const UserGrowthMetrics = () => {
  const [metrics, setMetrics] = useState<UserGrowthMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await userGrowthMetricsService.getUserGrowthMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div>Loading metrics...</div>;
  }

  if (error || !metrics) {
    return <div>Error loading metrics: {error}</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Growth Metrics</CardTitle>
        <CardDescription>Track user growth and distribution over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="growth" className="space-y-4">
          <TabsList>
            <TabsTrigger value="growth">Growth Over Time</TabsTrigger>
            <TabsTrigger value="distribution">User Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics.monthlyUserGrowth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="totalUsers" 
                    stroke="#8884d8" 
                    name="Total Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recruiters" 
                    stroke="#82ca9d" 
                    name="Recruiters"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="regularUsers" 
                    stroke="#ffc658" 
                    name="Regular Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="distribution">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.userDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Number of Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserGrowthMetrics;