
export type MetricName = 'LCP' | 'FID' | 'CLS';
export type Timeframe = '24h' | '7d' | '30d';

export interface DataPoint {
  time: string;
  value: number;
}

export interface AnalyticsData {
  metric: MetricName;
  p75: number;
  points: DataPoint[];
  comparison: {
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
  };
}

export interface FilterOptions {
  metric: MetricName;
  timeframe: Timeframe;
}
