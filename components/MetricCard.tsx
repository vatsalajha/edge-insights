
import React from 'react';
import { AnalyticsData } from '../types';

interface MetricCardProps {
    metric: 'LCP' | 'FID' | 'CLS';
    data: AnalyticsData | null;
    isLoading: boolean;
}

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
);

const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const MetricCard: React.FC<MetricCardProps> = ({ metric, data, isLoading }) => {
    const unit = metric === 'CLS' ? '' : 'ms';
    const higherIsWorse = metric !== 'CLS'; // For most metrics, a higher value is worse. Let's assume for CLS it is too for simplicity.

    const getComparisonColor = () => {
        if (!data) return 'text-gray-400';
        const { changeType } = data.comparison;
        if (changeType === 'neutral') return 'text-gray-400';
        return (changeType === 'increase' && higherIsWorse) || (changeType === 'decrease' && !higherIsWorse)
            ? 'text-brand-red'
            : 'text-brand-green';
    };

    const ComparisonIndicator: React.FC = () => {
        if (!data || data.comparison.changeType === 'neutral') return null;

        const isIncrease = data.comparison.changeType === 'increase';
        return (
            <span className={`flex items-center text-sm font-medium ${getComparisonColor()}`}>
                {isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {Math.abs(data.comparison.change)}%
            </span>
        );
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-medium text-gray-400">{metric} (p75)</h3>
                <div className="mt-2 flex items-baseline space-x-2">
                    {isLoading ? (
                        <div className="h-10 w-2/3 bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                        <p className="text-4xl font-bold text-white">{data?.p75 ?? '-'}<span className="text-xl font-medium text-gray-400 ml-1">{unit}</span></p>
                    )}
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">vs previous period</span>
                {isLoading ? (
                     <div className="h-5 w-1/4 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                     <ComparisonIndicator />
                )}
            </div>
        </div>
    );
};

export default MetricCard;
