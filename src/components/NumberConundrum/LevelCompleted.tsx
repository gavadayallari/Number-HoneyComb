import React from 'react';

interface LevelCompletedProps {
    onNextLevel: () => void;
    level: number;
    stars: number;
}

const LevelCompleted: React.FC<LevelCompletedProps> = ({ onNextLevel, level, stars }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-bottom p-4 level-completed-overlay"
            style={{ backgroundImage: "url('/images/backgound-game.png')" }}>

            {/* Main Title - Responsive */}
            <div className="absolute top-4 md:top-4 z-50">
                <div className="bg-[#FFEE37] px-6 py-2 md:px-8 md:py-2 rounded-full">
                    <span
                        className="text-black uppercase whitespace-nowrap"
                        style={{
                            fontFamily: '"Black Han Sans", sans-serif',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '22px',
                            lineHeight: '34px',
                            letterSpacing: '0.1em', // 10%
                            verticalAlign: 'middle',
                        }}
                    >
                        Number HoneyComb
                    </span>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="relative w-full max-w-sm md:max-w-2xl flex flex-col items-center justify-center">

                {/* Card Background */}
                <div className="relative w-full aspect-[4/5] md:aspect-[16/10] mt-0 flex items-center justify-center">
                    <img
                        src="/images/Rectangle.png"
                        alt="Background"
                        className="absolute inset-0 w-[95%] h-[60%] mt-10 object-fill z-0"
                    />

                    {/* Content Overlay */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center pt-8 md:pt-4">

                        {/* Ribbon & Stars Section - Pull up slightly to overlap top */}
                        <div className="-mt-16 md:-mt-24 flex flex-col items-center gap-6">
                            {/* Star Rating Display */}
                            <div className="flex gap-0 mb-2 items-end h-16 md:h-20">
                                {/* Left Star */}
                                <img
                                    src="/images/star_big.png"
                                    alt="Star"
                                    className={`w-12 md:w-12 drop-shadow-lg transition-all duration-500 ${stars >= 2 ? 'scale-100 opacity-100' : 'scale-100 opacity-30 grayscale'}`}
                                    style={{ transitionDelay: '200ms' }}
                                />
                                {/* Center Star - Elevated */}
                                <img
                                    src="/images/star_big.png"
                                    alt="Star"
                                    className={`w-14 md:w-12 mb-4 md:mb-6 drop-shadow-lg transition-all duration-500 ${stars >= 1 ? 'scale-100 opacity-100' : 'scale-100 opacity-30 grayscale'}`}
                                    style={{ transitionDelay: '0ms' }}
                                />
                                {/* Right Star */}
                                <img
                                    src="/images/star_big.png"
                                    alt="Star"
                                    className={`w-12 md:w-12 drop-shadow-lg transition-all duration-500 ${stars >= 3 ? 'scale-100 opacity-100' : 'scale-100 opacity-30 grayscale'}`}
                                    style={{ transitionDelay: '400ms' }}
                                />
                            </div>

                            {/* Level Ribbon */}
                            <div className="relative flex items-center justify-center -mt-8">
                                <img
                                    src="/images/level-img.png"
                                    alt="Level Badge"
                                    className="w-48 md:w-52 drop-shadow-lg"
                                />
                                <span className="absolute text-black -mt-4"
                                    style={{
                                        fontFamily: 'Nunito',
                                        fontWeight: 800,
                                        fontSize: '22px',
                                        lineHeight: '100%',
                                        letterSpacing: '0%',
                                        textAlign: 'center',
                                        fontStyle: 'normal' // 'Black' font style usually implies weight 900
                                    }}
                                >
                                    Level {level}
                                </span>
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="flex-1 flex items-center justify-center">
                            <h2 className="text-2xl md:text-4xl font-extrabold text-black drop-shadow-sm text-center px-4 leading-tight">
                                Level Completed Nice Work!!!
                            </h2>
                        </div>

                        {/* Next Button */}
                        <div className="pb-12 md:pb-40 scale-90 md:scale-100">
                            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-24 bg-white/50 blur-3xl rounded-full -z-10"></div>
                            <button
                                onClick={onNextLevel}
                                className="active:scale-95 transition-transform hover:scale-105 focus:outline-none"
                            >
                                <img
                                    src="/images/Button-next-level.png"
                                    alt="Next Level"
                                    className="w-48 md:w-64 h-auto object-contain drop-shadow-lg"
                                    draggable={false}
                                />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelCompleted;
