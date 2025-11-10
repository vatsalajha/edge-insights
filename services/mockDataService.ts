import { AnalyticsData, MetricName, Timeframe, DataPoint } from '../types';

// This file contains the logic for generating mock analytics data.
// It's used by the Cloudflare Function in production and by the frontend
// service directly during local development to avoid 404 errors.

const generateDataPoints = (timeframe: Timeframe, baseValue: number, fluctuation: number): DataPoint[] => {
  const now = new Date();
  const points: DataPoint[] = [];
  let numPoints: number;
  let interval: 'hour' | 'day';

  switch (timeframe) {
    case '24h':
      numPoints = 24;
      interval = 'hour';
      break;
    case '7d':
      numPoints = 7;
      interval = 'day';
      break;
    case '30d':
      numPoints = 30;
      interval = 'day';
      break;
    default:
      numPoints = 24;
      interval = 'hour';
  }

  for (let i = numPoints - 1; i >= 0; i--) {
    const time = new Date(now);
    if (interval === 'hour') {
      time.setUTCHours(now.getUTCHours() - i);
    } else {
      time.setUTCDate(now.getUTCDate() - i);
    }
    
    const value = baseValue + (Math.random() - 0.5) * fluctuation;
    points.push({ time: time.toISOString(), value: parseFloat(value.toFixed(3)) });
  }
  return points;
};

const mockApiData: Record<MetricName, { baseValue: number; fluctuation: number; unit: string }> = {
  LCP: { baseValue: 1800, fluctuation: 400, unit: 'ms' },
  FID: { baseValue: 20, fluctuation: 15, unit: 'ms' },
  CLS: { baseValue: 0.1, fluctuation: 0.08, unit: '' },
};

export const generateAnalyticsData = (metric: MetricName, timeframe: Timeframe): AnalyticsData => {
    const { baseValue, fluctuation } = mockApiData[metric];
    const points = generateDataPoints(timeframe, baseValue, fluctuation);
    const p75 = points.map(p => p.value).sort((a, b) => a - b)[Math.floor(points.length * 0.75)] || baseValue;
    
    const change = (Math.random() * 10 - 5); // Random change between -5% and +5%
    const changeType = change > 0.5 ? 'increase' : change < -0.5 ? 'decrease' : 'neutral';

    return {
      metric,
      p75: parseFloat(p75.toFixed(metric === 'CLS' ? 3 : 0)),
      points,
      comparison: {
        change: parseFloat(change.toFixed(1)),
        changeType,
      }
    };
};
