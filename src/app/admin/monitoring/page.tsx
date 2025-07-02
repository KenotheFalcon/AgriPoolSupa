'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { monitoringService } from '@/lib/monitoring';
import { performanceMonitor } from '@/lib/performance';

interface Alert {
  type: 'performance' | 'error' | 'warning';
  message: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceData {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  sectionLoadTimes: Record<string, number>;
}

export default function MonitoringDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<PerformanceData | null>(null);
  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    // Fetch initial data
    fetchAlerts();
    fetchMetrics();

    // Set up polling
    const interval = setInterval(() => {
      fetchAlerts();
      fetchMetrics();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/monitoring/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Monitoring Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='alerts'>Alerts</TabsTrigger>
          <TabsTrigger value='metrics'>Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value='alerts'>
          <Card className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>Recent Alerts</h2>
            <div className='space-y-4'>
              {alerts.length === 0 ? (
                <p className='text-gray-500'>No alerts</p>
              ) : (
                alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      alert.type === 'error'
                        ? 'bg-red-50 border border-red-200'
                        : alert.type === 'warning'
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <p className='font-medium'>{alert.message}</p>
                        {alert.metadata && (
                          <pre className='mt-2 text-sm text-gray-600'>
                            {JSON.stringify(alert.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                      <span className='text-sm text-gray-500'>
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value='metrics'>
          <Card className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>Performance Metrics</h2>
            {metrics ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <MetricCard title='First Contentful Paint' value={`${metrics.fcp}ms`} />
                <MetricCard title='Largest Contentful Paint' value={`${metrics.lcp}ms`} />
                <MetricCard title='First Input Delay' value={`${metrics.fid}ms`} />
                <MetricCard title='Cumulative Layout Shift' value={metrics.cls.toFixed(3)} />
                <MetricCard title='Time to First Byte' value={`${metrics.ttfb}ms`} />
              </div>
            ) : (
              <p className='text-gray-500'>No metrics available</p>
            )}

            <h3 className='text-lg font-semibold mt-6 mb-4'>Section Load Times</h3>
            {metrics?.sectionLoadTimes ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {Object.entries(metrics.sectionLoadTimes).map(([section, time]) => (
                  <MetricCard key={section} title={section} value={`${time}ms`} />
                ))}
              </div>
            ) : (
              <p className='text-gray-500'>No section load times available</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className='p-4'>
      <h3 className='text-sm font-medium text-gray-500'>{title}</h3>
      <p className='text-2xl font-semibold mt-1'>{value}</p>
    </Card>
  );
}
