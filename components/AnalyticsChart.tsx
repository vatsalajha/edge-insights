
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AnalyticsData, MetricName } from '../types';

interface AnalyticsChartProps {
    data: AnalyticsData | null;
    isLoading: boolean;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label, metric }) => {
    if (active && payload && payload.length) {
        const unit = metric === 'CLS' ? '' : 'ms';
        return (
            <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-xl">
                <p className="text-sm text-gray-400">{new Date(label).toLocaleString()}</p>
                <p className="text-base font-bold text-white">{`${metric}: ${payload[0].value}${unit}`}</p>
            </div>
        );
    }
    return null;
};


const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, isLoading }) => {
    
    if (isLoading) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-96 flex items-center justify-center">
                 <div className="w-full h-full bg-gray-700 rounded animate-pulse"></div>
            </div>
        );
    }
    
    if (!data || data.points.length === 0) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-96 flex items-center justify-center">
                <p className="text-gray-500">No data available for the selected period.</p>
            </div>
        );
    }

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem);
        if (data.points.length <= 7) { // Daily for 7d
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }
        if (data.points.length <= 30) { // Daily for 30d
             return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }); // Hourly for 24h
    };
    
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-96">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.points} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                        dataKey="time" 
                        stroke="#9CA3AF"
                        tickFormatter={formatXAxis}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip metric={data.metric} />} />
                    <Area type="monotone" dataKey="value" stroke="#2563EB" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;
