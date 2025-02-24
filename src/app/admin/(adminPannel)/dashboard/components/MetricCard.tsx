import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, TrendingUp, ArrowUp, ArrowDown, IndianRupee } from 'lucide-react';
import  { ApiError } from '../../../lib/axios-config';
import { dashboardMetrics } from '../api/metricService';
import { DashboardMetrics, MetricCardProps } from '../Types/metrics';

// Keep existing types and useMetricsData hook...


const useMetricsData = () => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await dashboardMetrics.getdashboardMetrics()
        setData(response);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch metrics data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 300000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};

const useCountAnimation = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!end) return;
    let startTimestamp: number | null = null;
    const startValue = 0;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);
  
  return count;
};



const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend, format }) => {
  const isPositive = trend?.type === 'increase';
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;
  
  const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
  const animatedValue = useCountAnimation(numericValue);
  
  return (
    <Card className="bg-white hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-medium text-gray-600">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">
              {format(animatedValue)}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
            <TrendIcon className={`w-5 h-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-3">
          <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value} from last month
          </div>
        </div>
      </CardContent>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-5">
        <Icon className="w-24 h-24" />
      </div>
    </Card>
  );
};

const LoadingCard = () => (
  <Card className="bg-gray-50 animate-pulse">
    <CardContent className="p-6 h-full">
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mt-6"></div>
      </div>
    </CardContent>
  </Card>
);

const MetricsDashboard: React.FC = () => {
  const { data, loading, error } = useMetricsData();

  const metricsConfig = [
    {
      id: 'totalUsers',
      title: 'Total Users',
      icon: Users,
      format: (val: number) => val.toLocaleString()
    },
    {
      id: 'activeUsers',
      title: 'Active Users',
      icon: UserCheck,
      format: (val: number) => val.toLocaleString()
    },
    {
      id: 'revenue',
      title: 'Revenue',
      icon: IndianRupee,
      format: (val: number) => `₹${val.toLocaleString()}`
    },
    {
      id: 'growthRate',
      title: 'Growth Rate',
      icon: TrendingUp,
      format: (val: number) => `${val.toFixed(1)}%`
    }
  ] as const;

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading metrics: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? metricsConfig.map((_, index) => <LoadingCard key={index} />)
          : metricsConfig.map((metricConfig) => (
              <MetricCard
                key={metricConfig.id}
                title={metricConfig.title}
                value={data![metricConfig.id].value}
                icon={metricConfig.icon}
                trend={data![metricConfig.id].trend}
                format={metricConfig.format}
              />
            ))
        }
      </div>
    </div>
  );
};

export default MetricsDashboard;