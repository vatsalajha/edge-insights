import { generateAnalyticsData } from '../../services/mockDataService';
import type { MetricName, Timeframe } from '../../types';

// Cloudflare Pages Functions context
interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // ANALYTICS_KV: KVNamespace;
  // Example binding to D1. Learn more at https://developers.cloudflare.com/workers/runtime-apis/d1/
  // ANALYTICS_DB: D1Database;
}

type PagesFunction<
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: {
  request: Request;
  env: Env;
  params: Record<Params, string>;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Data;
}) => Response | Promise<Response>;


/**
 * Handles GET requests to /api/metrics
 * This function is a Cloudflare Pages Function.
 * @see https://developers.cloudflare.com/pages/functions/
 */
export const onRequestGet: PagesFunction = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const metric = searchParams.get('metric') as MetricName;
  const timeframe = searchParams.get('timeframe') as Timeframe;

  if (!metric || !['LCP', 'FID', 'CLS'].includes(metric)) {
    return new Response(JSON.stringify({ error: 'Invalid or missing "metric" parameter. Use one of: LCP, FID, CLS.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!timeframe || !['24h', '7d', '30d'].includes(timeframe)) {
     return new Response(JSON.stringify({ error: 'Invalid or missing "timeframe" parameter. Use one of: 24h, 7d, 30d.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Simulate real-world API latency
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
  
  // In a real application, you would fetch from a database like D1 or a KV store.
  // This helps persist data and separate data storage from compute.
  //
  // --- D1 Example ---
  // To fetch historical data from a D1 database:
  //
  // 1. Create a D1 binding named 'ANALYTICS_DB' in your Pages project settings.
  // 2. Your schema might look like:
  //    CREATE TABLE metrics (timestamp TEXT, name TEXT, value REAL);
  // 3. You could insert data with a separate scheduled Worker:
  //    await context.env.ANALYTICS_DB.prepare(
  //      "INSERT INTO metrics (timestamp, name, value) VALUES (?1, ?2, ?3)"
  //    ).bind(new Date().toISOString(), metric, newValue).run();
  // 4. Then, you would query it here:
  //    const { results } = await context.env.ANALYTICS_DB.prepare(
  //      "SELECT * FROM metrics WHERE name = ?1 AND timestamp > date('now', '-7 days')"
  //    ).bind(metric).all();
  //    const data = processD1Results(results); // (you'd need to write this function)

  const data = generateAnalyticsData(metric, timeframe);

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      // Set a short cache time to balance freshness and performance
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
};
