import { AnalyticsData, MetricName, Timeframe } from '../types';
import { generateAnalyticsData } from './mockDataService';

// Detect if we're in a local development environment (e.g., running from file:// or localhost).
const isLocalDevelopment = typeof window !== 'undefined' && ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

export const fetchAnalyticsData = async (metric: MetricName, timeframe: Timeframe): Promise<AnalyticsData> => {
  // If we're developing locally, use the mock data generator directly to avoid 404s.
  // This allows the frontend to work without running the full Cloudflare dev server.
  if (isLocalDevelopment) {
    console.warn("Running in local development mode. Using mock data generator instead of API fetch.");
    // Simulate network latency to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    return Promise.resolve(generateAnalyticsData(metric, timeframe));
  }

  // In production (or when running with `wrangler pages dev`), fetch from the real Cloudflare Worker backend.
  const url = `/api/metrics?metric=${metric}&timeframe=${timeframe}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch analytics data. Server responded with ${response.status}.`);
    }

    return response.json();
  } catch (error) {
    console.error("Network or fetch error:", error);
    // Re-throw the error so the calling component can handle it
    throw error;
  }
};
