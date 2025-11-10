
import React from 'react';
import { FilterOptions, MetricName, Timeframe } from '../types';

interface FilterControlsProps {
    filters: FilterOptions;
    onFilterChange: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
    isLoading: boolean;
}

const metrics: MetricName[] = ['LCP', 'FID', 'CLS'];
const timeframes: Timeframe[] = ['24h', '7d', '30d'];

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange, isLoading }) => {
    
    const buttonBaseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-blue";
    const activeClasses = "bg-brand-blue text-white";
    const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";
    
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            {/* Metric Selector */}
            <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg">
                {metrics.map((metric) => (
                    <button
                        key={metric}
                        onClick={() => onFilterChange('metric', metric)}
                        disabled={isLoading}
                        className={`${buttonBaseClasses} ${filters.metric === metric ? activeClasses : inactiveClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {metric}
                    </button>
                ))}
            </div>

            {/* Timeframe Selector */}
            <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg">
                {timeframes.map((timeframe) => (
                    <button
                        key={timeframe}
                        onClick={() => onFilterChange('timeframe', timeframe)}
                        disabled={isLoading}
                        className={`${buttonBaseClasses} ${filters.timeframe === timeframe ? activeClasses : inactiveClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {timeframe === '24h' && '24 Hours'}
                        {timeframe === '7d' && '7 Days'}
                        {timeframe === '30d' && '30 Days'}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterControls;
