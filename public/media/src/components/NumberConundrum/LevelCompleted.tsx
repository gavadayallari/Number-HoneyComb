import React from 'react';

interface LevelCompletedProps {
    onNextLevel: () => void;
    level: number;
}

const LevelCompleted: React.FC<LevelCompletedProps> = ({ onNextLevel, level }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-bottom"
            style={{ backgroundImage: "url('/images/backgound-game.png')" }}>

            {/* Main Title */}
            <div className="absolute top-10 md:top-4 z-50">
                <div className="bg-[#FFEE37] px-8 py-2 rounded-full">
                    <h1 className="text-2xl md:text-4xl font-black text-black uppercase tracking-wider">
                        Number HoneyComb
                    </h1>
                </div>
            </div>

            {/* Main Card */}
            <div className="relative w-[80%] max-w-4xl mt-[-60px] flex items-center justify-center">
                {/* Background Image */}
                <img
                    src="/images/Rectangle.png"
                    alt="Level Background"
                    className="absolute inset-0 w-[70%] h-[90%] left-1/2 -translate-x-1/2 object-fill z-0"
                />

                {/* Content */}
                <div className="relative z-10 p-8 md:p-16 w-full flex flex-col items-center">

                    {/* Level Ribbon Header */}
                    {/* This mimics the ribbon with stars in the design */}
                    <div className="absolute -top-26 z-20 flex flex-col items-center">

                        {/* Ribbon/Banner Image */}
                        <div className="relative flex items-center justify-center flex-col">
                            <img
                                src="/images/star_big.png"
                                alt="Level Badge"
                                className="w-48 md:w-14 drop-shadow-lg"
                            />
                            <img
                                src="/images/level-img.png"
                                alt="Level Badge"
                                className="w-48 md:w-64 drop-shadow-lg"
                            />
                            <span className="absolute text-2xl md:text-3xl mt-8 px-8 py-3 rounded-2xl font-black text-black tracking-wide pt-2 drop-shadow-md z-50">
                                Level {level}
                            </span>
                        </div>
                    </div>

                    {/* Level Completed Text */}
                    <div className="mt-16 md:mt-4 mb-10 text-center">
                        <h2 className="text-2xl md:text-4xl font-extrabold text-black drop-shadow-sm">
                            Level Completed Nice Work!!!
                        </h2>
                    </div>

                    {/* White Glow / Sunburst Effect (Background for button) */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-white/50 blur-3xl rounded-full -z-10"></div>

                    {/* Next Level Button */}
                    <button
                        onClick={onNextLevel}
                        className="bg-gradient-to-b from-[#4BC5B9] to-[#2E8B82] text-white font-black text-xl md:text-2xl px-12 py-3 rounded-full shadow-[0_4px_0_#1A5F59] active:shadow-[0_2px_0_#1A5F59] active:translate-y-1 transition-all hover:scale-105"
                    >
                        NEXT LEVEL
                    </button>

                </div>
            </div>
        </div>
    );
};

export default LevelCompleted;
