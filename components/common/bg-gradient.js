import React from 'react';

const BgGradient = ({ className = '' }) => {
    return (
        <div
            className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}
            aria-hidden="true"
        >
            {/* Soft left-side ambient glow */}
            <div
                className="absolute left-[-200px] top-1/6 w-[600px] h-[600px]
        bg-gradient-to-br from-rose-500 via-pink-400 to-transparent
        opacity-15 blur-[100px] rounded-full"
            />
        </div>
    );
};

export default BgGradient;
