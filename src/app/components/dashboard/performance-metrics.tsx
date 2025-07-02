'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceMetricsProps {
  data: {
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
    created_at: string;
  }[];
}

export function PerformanceMetrics({ data }: PerformanceMetricsProps) {
  const chartData = data.map((item) => ({
    ...item,
    timestamp: new Date(item.created_at).toLocaleTimeString(),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[400px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='timestamp' />
              <YAxis />
              <Tooltip />
              <Line type='monotone' dataKey='fcp' stroke='#8884d8' name='First Contentful Paint' />
              <Line
                type='monotone'
                dataKey='lcp'
                stroke='#82ca9d'
                name='Largest Contentful Paint'
              />
              <Line type='monotone' dataKey='fid' stroke='#ffc658' name='First Input Delay' />
              <Line type='monotone' dataKey='cls' stroke='#ff8042' name='Cumulative Layout Shift' />
              <Line type='monotone' dataKey='ttfb' stroke='#0088fe' name='Time to First Byte' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
