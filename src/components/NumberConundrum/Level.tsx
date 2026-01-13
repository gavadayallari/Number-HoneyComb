import React from 'react';

interface LevelProps {
    onLevelSelect: (level: number) => void;
    levelStars?: Record<number, number>;
}

const Hexagon = ({
    number,
    status,
    numStars = 0,
    onClick
}: {
    number: number;
    status: 'locked' | 'active' | 'completed';
    numStars?: number;
    onClick: () => void;
}) => {
    const isLocked = status === 'locked';

    return (
        <div
            className={`relative flex items-center justify-center w-20 h-20 md:w-16 md:h-16 cursor-pointer transition-transform hover:scale-105 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={!isLocked ? onClick : undefined}
        >
            {/* Hexagon Shape Image */}
            <img
                src="images/State=Default-1.png"
                alt=""
                className="absolute inset-0 w-20 h-20 md:w-16 md:h-16 object-contain drop-shadow-sm"
            />

            {/* Number */}
            <span className={`absolute text-2xl md:text-3xl font-bold ${status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>
                {number}
            </span>

            {/* Stars for Completed Levels */}
            {status === 'completed' && numStars > 0 && (
                <div className="absolute -top-2 flex justify-center w-full z-20">
                    <div className="flex items-end space-x-0">
                        {numStars >= 1 && <img src="images/star_big.png" alt="star" className={`w-5 h-5 drop-shadow-sm -rotate-12 mb-[1px] ${numStars >= 1 ? '' : 'grayscale opacity-30'}`} />}
                        {numStars >= 2 && <img src="images/star_big.png" alt="star" className={`w-5 h-5 drop-shadow-sm mb-2 z-10 ${numStars >= 2 ? '' : 'grayscale opacity-30'}`} />}
                        {numStars >= 3 && <img src="images/star_big.png" alt="star" className={`w-5 h-5 drop-shadow-sm rotate-12 mb-[1px] ${numStars >= 3 ? '' : 'grayscale opacity-30'}`} />}
                    </div>
                </div>
            )}
        </div>
    );
};

const Level: React.FC<LevelProps> = ({ onLevelSelect, levelStars = {} }) => {
    // Mock data for level status based on the image
    // Level 1: Completed if has stars
    // Level 2: Active
    // Others: Locked
    // In a real app, this would come from props or a store
    const getLevelStatus = (level: number) => {
        if (levelStars[level] !== undefined && levelStars[level] > 0) return 'completed';
        if (level === 1) return 'active'; // Always open L1
        if (levelStars[level - 1] !== undefined) return 'active'; // Open if prev completed
        return 'locked';
    };

    return (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-cover bg-bottom pt-16 md:pt-0 level-page-container"
            style={{ backgroundImage: "url('/images/backgound-game.png')" }}>
            {/* Main Title - Responsive Position */}
            <div className="absolute top-4 md:top-8 z-50">
                <div className="bg-[#FFEE37] px-6 py-2 md:px-8 md:py-2 rounded-full">
                    <h1 className="text-xl md:text-2xl font-black text-black uppercase tracking-wider">
                        Number HoneyComb
                    </h1>
                </div>
            </div>

            {/* Content Container - Centered nicely */}
            <div className="relative w-full max-w-sm md:max-w-3xl flex items-center justify-center p-4">

                {/* Background Card Image */}
                <div className="relative w-full aspect-[4/5] md:aspect-[16/10]">
                    <img
                        src="/images/Rectangle.png"
                        alt="Level Background"
                        className="absolute inset-0 w-[90%] h-[65%] ml-10 object-fill z-0"
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        {/* Levels Header Image - Floating at top */}
                        <div className="w-1/2 md:w-1/3 -mt-6 md:-mt-5 z-20 flex justify-center items-center">
                            <img
                                src="images/Level.png"
                                alt="Levels"
                                className="w-[60%] drop-shadow-lg"
                            />
                        </div>

                        {/* Grid Container */}
                        <div className="flex-1 flex items-center justify-center w-full px-6 md:px-12 py-4 md:py-2 mt-6 md:mt-[-160px] ml-16">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-2 gap-y-2 md:gap-x-4 md:gap-y-6 mr-15 justify-items-center">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((level) => (
                                    <Hexagon
                                        key={level}
                                        number={level}
                                        status={getLevelStatus(level)}
                                        numStars={levelStars[level]}
                                        onClick={() => onLevelSelect(level)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Level;
