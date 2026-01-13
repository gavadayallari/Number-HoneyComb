import React from 'react';

interface LevelProps {
    onLevelSelect: (level: number) => void;
}

const Hexagon = ({
    number,
    status,
    onClick
}: {
    number: number;
    status: 'locked' | 'active' | 'completed';
    onClick: () => void;
}) => {
    const isLocked = status === 'locked';

    return (
        <div
            className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 cursor-pointer transition-transform hover:scale-105 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={!isLocked ? onClick : undefined}
        >
            {/* Hexagon Shape SVG */}
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-sm"
                style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))' }}
            >
                <path
                    d="M50 5 L95 27.5 V72.5 L50 95 L5 72.5 V27.5 Z"
                    fill="white"
                    stroke={status === 'locked' ? '#edad7cff' : '#E88B46'}
                    strokeWidth="6"
                />
            </svg>

            {/* Number */}
            <span className={`absolute text-2xl md:text-3xl font-bold ${status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>
                {number}
            </span>

            {/* Stars for Completed Levels (Example for Level 1) */}
            {status === 'completed' && (
                <div className="absolute -top-2 flex gap-1 transform scale-75">
                    {[1, 2, 3].map((i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFD700" className="w-6 h-6 drop-shadow-sm">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    ))}
                </div>
            )}
        </div>
    );
};

const Level: React.FC<LevelProps> = ({ onLevelSelect }) => {
    // Mock data for level status based on the image
    // Level 1: Completed (Stars)
    // Level 2: Active
    // Others: Locked
    // In a real app, this would come from props or a store
    const getLevelStatus = (level: number) => {
        if (level === 1) return 'completed';
        if (level === 2) return 'active';
        return 'locked';
    };

    return (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-cover bg-bottom"
            style={{ backgroundImage: "url('/images/backgound-game.png')" }}> {/* Reusing game background if appropriate or use a specific one */}

            {/* Main Title */}
            <div className="absolute top-10 md:top-16 z-50">
                <div className="bg-[#FFEE37] px-8 py-2 rounded-full ">
                    <h1 className="text-2xl md:text-4xl font-black text-black uppercase tracking-wider">
                        Number HoneyComb
                    </h1>
                </div>
            </div>

            {/* Levels Card */}
            <div className="relative w-[90%] max-w-4xl mt-10 flex items-center justify-center">
                {/* Background Image */}
                <img
                    src="/images/Rectangle.png"
                    alt="Level Background"
                    className="absolute inset-0 w-full h-full object-fill z-0"
                />

                {/* Content Container */}
                <div className="relative z-10 p-8 md:p-12 w-full">
                    {/* LEVELS Header Pill */}
                    {/* LEVELS Header Image */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <img
                            src="images/Level.png"
                            alt="Levels"
                            className="w-48 md:w-64 drop-shadow-lg"
                        />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 mt-6 justify-items-center">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((level) => (
                            <Hexagon
                                key={level}
                                number={level}
                                status={getLevelStatus(level)}
                                onClick={() => onLevelSelect(level)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Level;
