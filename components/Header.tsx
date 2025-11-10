
import React from 'react';

const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.36,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14c0,3.31 2.69,6 6,6h13c2.76,0 5-2.24 5-5C24,12.36 21.95,10.22 19.36,10.04z" />
    </svg>
);

const Header: React.FC = () => {
    return (
        <header className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center space-x-3">
                <CloudIcon />
                <h1 className="text-xl font-bold text-white">Edge Insights</h1>
            </div>
            <div className="flex items-center space-x-4">
                 <div className="text-sm text-gray-400">Project: <span className="font-semibold text-white">My Awesome App</span></div>
                <img src="https://picsum.photos/40" alt="User Avatar" className="h-8 w-8 rounded-full" />
            </div>
        </header>
    );
};

export default Header;
