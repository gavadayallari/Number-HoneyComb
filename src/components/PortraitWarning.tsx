import React from 'react';

const PortraitWarning: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center text-center p-6 hidden md:hidden portrait-warning">
            {/* Green Rotating Phone Icon */}
            <div className="mb-6 animate-spin-slow">
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ADE80" // Green-400 equivalent
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-16 h-16"
                >
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                </svg>
            </div>

            {/* Text Content */}
            <h2 className="text-white text-xl md:text-2xl font-bold font-sans">
                Rotate your device to landscape <br />
                for the best experience.
            </h2>
        </div>
    );
};

export default PortraitWarning;
