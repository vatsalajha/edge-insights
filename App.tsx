
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import AnalyticsChart from './components/AnalyticsChart';
import FilterControls from './components/FilterControls';
import { fetchAnalyticsData } from './services/analyticsService';
import { AnalyticsData, FilterOptions, MetricName } from './types';

const App: React.FC = () => {
    const [filters, setFilters] = useState<FilterOptions>({
        metric: 'LCP',
        timeframe: '7d',
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [analyticsData, setAnalyticsData] = useState<Record<MetricName, AnalyticsData | null>>({
        LCP: null,
        FID: null,
        CLS: null,
    });
    const [chartData, setChartData] = useState<AnalyticsData | null>(null);

    const handleFilterChange = useCallback(<K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    }, []);

    const fetchDataForMetric = useCallback(async (metric: MetricName, timeframe: string) => {
        try {
            const data = await fetchAnalyticsData(metric, timeframe as FilterOptions['timeframe']);
            setAnalyticsData(prev => ({...prev, [metric]: data}));
            if (metric === filters.metric) {
                setChartData(data);
            }
        } catch (error) {
            console.error(`Failed to fetch data for ${metric}`, error);
        }
    }, [filters.metric]);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            // Fetch data for all metric cards first
            const metricPromises = [
                fetchDataForMetric('LCP', filters.timeframe),
                fetchDataForMetric('FID', filters.timeframe),
                fetchDataForMetric('CLS', filters.timeframe)
            ];
            await Promise.all(metricPromises);
            
            // Specifically fetch data for the active chart
            const activeChartData = await fetchAnalyticsData(filters.metric, filters.timeframe);
            setChartData(activeChartData);

            setIsLoading(false);
        };
        fetchAllData();
    }, [filters, fetchDataForMetric]);


    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                <FilterControls 
                    filters={filters} 
                    onFilterChange={handleFilterChange}
                    isLoading={isLoading}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <MetricCard metric="LCP" data={analyticsData.LCP} isLoading={isLoading} />
                    <MetricCard metric="FID" data={analyticsData.FID} isLoading={isLoading} />
                    <MetricCard metric="CLS" data={analyticsData.CLS} isLoading={isLoading} />
                </div>

                <AnalyticsChart data={chartData} isLoading={isLoading} />
            </main>
        </div>
    );
};

export default App;
