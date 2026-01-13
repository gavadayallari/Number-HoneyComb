import React, { useEffect } from 'react';
import { useConundrumGame } from '@/hooks/useConundrumGame';
import type { BlockData, KeypadItem } from '@/hooks/useConundrumGame';
import { cn, formatTime } from '@/lib/utils';
import TimerSvg from "@/assets/TimerSvg"; // Import TimerSvg

// --- Pyramid Components ---

// Block Component with SVG Hexagon
interface BlockProps {
    data: BlockData;
    isSelected: boolean;
    onClick: () => void;
}

const Block: React.FC<BlockProps> = ({ data, isSelected, onClick }) => {
    // Determine image source based on state
    const getImageSrc = () => {
        if (data.isPrefilled) {
            return "images/State=Fixed-2.png";
        }
        // User inputs should use the Default image (white/empty style) 
        // instead of Answer image, as requested.
        return "images/State=Default-1.png";
    };

    const textColor = data.isPrefilled ? "text-white" : "text-gray-900";

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative flex items-center justify-center cursor-pointer transition-transform select-none",
                "w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13",
                isSelected ? "scale-110 drop-shadow-xl z-20" : "hover:scale-105 z-10"
            )}
        >
            <img
                src={getImageSrc()}
                alt="Block"
                className={cn(
                    "absolute inset-0 w-full h-full object-contain drop-shadow-sm transition-all",
                    data.status === "incorrect" ? "filter hue-rotate-180 saturate-200" : ""
                )}
                draggable={false}
            />

            <span className={cn("relative text-base sm:text-xl md:text-xl font-bold z-10 select-none", textColor)}>
                {data.value === "" ? "?" : data.value}
            </span>
        </div>
    );
};


// Pyramid Component
interface PyramidProps {
    grid: BlockData[][];
    selectedBlock: { r: number; c: number } | null;
    onBlockSelect: (r: number, c: number) => void;
}

const Pyramid: React.FC<PyramidProps> = ({ grid, selectedBlock, onBlockSelect }) => {
    return (
        <div className="flex flex-col items-center -space-y-1 sm:-space-y-2 md:-space-y-3 mt-2 sm:mt-2 md:mt-3 p-1 sm:p-2"> {/* Responsive vertical overlap */}
            {grid.map((row, rIndex) => (
                <div key={rIndex} className="flex gap-0 justify-center">
                    {row.map((block, cIndex) => (
                        <Block
                            key={`${rIndex}-${cIndex}`}
                            data={block}
                            isSelected={selectedBlock?.r === rIndex && selectedBlock?.c === cIndex}
                            onClick={() => onBlockSelect(rIndex, cIndex)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

// --- Keypad Components ---

interface KeypadProps {
    numbers: KeypadItem[];
    onSelect: (id: string, val: number) => void;
}

interface HexButtonProps {
    label: string | number;
    onClick?: () => void;
    isAction?: boolean;
    isVisible?: boolean;
}

const HexButton: React.FC<HexButtonProps> = ({ label, onClick, isAction, isVisible = true }) => {
    return (
        <button
            onClick={onClick}
            className={`
                relative flex items-center justify-center transition-transform active:scale-95 focus:outline-none
                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                ${!isVisible ? 'invisible pointer-events-none' : ''}
            `}
            disabled={!isVisible}
        >
            <img
                src="images/State=Answer-3.png"
                alt=""
                className="absolute inset-0 w-full h-full object-contain drop-shadow-sm"
                draggable={false}
            />
            <span className={`relative z-10 font-bold text-base sm:text-xl md:text-2xl ${isAction ? 'text-red-500' : 'text-gray-900'}`}>
                {label}
            </span>
        </button>
    );
};


const Keypad: React.FC<KeypadProps> = ({ numbers, onSelect }) => {
    // Ensure we have 15 items roughly. If less, we just render what we have.
    const row1Items = numbers.slice(0, 7);
    const row2Items = numbers.slice(7, 15);

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto nc-keypad-container">
            <div className="flex justify-center flex-wrap -space-x-1 sm:-space-x-1 md:-space-x-1 z-10 nc-keypad-row">
                {row1Items.map((item) => (
                    <HexButton
                        key={item.id}
                        label={item.value}
                        onClick={() => onSelect(item.id, item.value)}
                        isVisible={!item.isUsed}
                    />
                ))}
            </div>
            <div className="flex justify-center flex-wrap gap-0 -space-x-1 sm:-space-x-1 md:-space-x-1 -mt-2 sm:-mt-2 md:-mt-2 z-0 nc-keypad-row">
                {row2Items.map((item) => (
                    <HexButton
                        key={item.id}
                        label={item.value}
                        onClick={() => onSelect(item.id, item.value)}
                        isVisible={!item.isUsed}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Main Game Component ---

interface NumberConundrumGameProps {
    onWin: (stars: number) => void;
    isPaused?: boolean;
    level: number;
    timeLeft?: number;
    gameName?: string;
}

const NumberConundrumGame: React.FC<NumberConundrumGameProps> = ({ onWin, isPaused = false, level, timeLeft = 0, gameName }) => {
    const {
        gameState,
        selectBlock,
        handleKeypadSelect,
        checkSolution,
    } = useConundrumGame("1-50");

    useEffect(() => {
        if (gameState.isComplete) {
            onWin(gameState.stars);
        }
    }, [gameState.isComplete, gameState.stars, onWin]);

    return (
        <div className="relative flex flex-col h-full w-full max-w-4xl mx-auto p-4 md:p-0 -mt-2 sm:-mt-2 md:-mt-15 overflow-hidden select-none nc-game-container">

            {/* Header: Game Title, Timer, Level */}
            <div className="flex-none flex flex-col items-center justify-center w-full z-50 py-1 sm:py-2 gap-1 sm:gap-5 mt-0 sm:mt-0 nc-header-container">
                {/* Top Row: Title and Timer */}
                <div className="flex flex-row items-center justify-center gap-2 sm:gap-38 ml-80 w-full pointer-events-none">
                    {/* Game Title */}
                    {gameName && (
                        <div className="bg-[#FFEE37] px-3 py-1 sm:px-6 sm:py-1 rounded-full shadow-sm border border-transparent">
                            <span
                                className="text-xs sm:text-xl md:text-2xl font-black text-black tracking-wider whitespace-nowrap luckiest-guy-regular"
                                style={{ fontFamily: '"Black Han Sans", sans-serif' }}
                            >
                                {gameName}
                            </span>
                        </div>
                    )}

                    {/* Timer */}
                    <div className="px-3 py-1 sm:px-5 sm:py-1 flex items-center gap-1 sm:gap-2">
                        <div className="w-4 h-4 sm:w-6 sm:h-6 -mt-3 flex-shrink-0">
                            <TimerSvg />
                        </div>
                        <span className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 tabular-nums leading-none pt-0.5">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Level Indicator */}
                <div className="flex items-center justify-center mt-4">
                    <span className="text-lg md:text-xl font-black text-black uppercase tracking-wider"
                        style={{ fontFamily: '"Nunito", sans-serif' }}>
                        LEVEL {level}
                    </span>
                </div>
            </div>

            {/* Main Game Area (Board + Bees) */}
            <div className="flex-1 w-full flex flex-col items-center justify-center relative min-h-0">

                {/* Visual Elements (Bees) - Responsive Positioning - Visible on all screens but scaled */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Position bees relative to this container. Centered for desktop, potentially overlapping on very small screens if not scaled carefully. */}
                    <img src="images/Honey-img.png" alt="Bee" className="absolute top-[10%] left-[35%] w-8 sm:w-10 md:w-10 animate-float-slow opacity-80 sm:opacity-100" />
                    <img src="images/Honey-right-top.png" alt="Bee" className="absolute top-[15%] right-[35%] w-8 sm:w-10 md:w-12 animate-float-medium opacity-80 sm:opacity-100" />
                    <img src="images/Honey-left-buttom.png" alt="Bee" className="absolute bottom-[20%] left-[27%] w-8 sm:w-10 md:w-12 animate-float-fast opacity-80 sm:opacity-100" />
                    <img src="images/Honey-rigth-buttom.png" alt="Bee" className="absolute bottom-[20%] right-[27%] w-8 sm:w-10 md:w-12 animate-float-slow opacity-80 sm:opacity-100" />
                </div>

                {/* Pyramid Board - Dynamic Scaling */}
                {/* Scale down on small screens to fit iPhone SE and others without overlapping bees/controls */}
                <div className="relative z-0 transform transition-transform scale-75 sm:scale-100 md:scale-110 origin-center nc-pyramid-container">
                    <Pyramid
                        grid={gameState.grid}
                        selectedBlock={gameState.selectedBlock}
                        onBlockSelect={isPaused ? () => { } : selectBlock}
                    />
                </div>
            </div>

            {/* Controls Section - Pushed to bottom with safe spacing */}
            <div className="flex-none w-full flex flex-col items-center gap-1 sm:gap-4 pb-2 sm:pb-6 md:pb-8 mt-1 sm:mt-8 z-10">

                {/* Keypad Container */}
                <div className={`w-full max-w-lg px-2 ${isPaused ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Keypad numbers={gameState.keypadNumbers} onSelect={handleKeypadSelect} />
                </div>

                {/* Submit Button */}
                <button
                    onClick={() => checkSolution()}
                    disabled={isPaused}
                    className={`
                        transition-transform hover:scale-105 active:scale-95 focus:outline-none mt-1 sm:mt-4 nc-submit-button
                        ${isPaused ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                    `}
                >
                    <img
                        src="images/Button-sumbit.png"
                        alt="Submit"
                        className="w-28 sm:w-48 md:w-56 h-auto object-contain drop-shadow-lg"
                        draggable={false}
                    />
                </button>
            </div>
        </div>
    );
};

export default NumberConundrumGame;
