import React from 'react';
import type { BlockData } from '@/hooks/useConundrumGame';
import { cn } from '@/lib/utils';

// Block Component with SVG Hexagon
interface BlockProps {
    data: BlockData;
    isSelected: boolean;
    onClick: () => void;
}

const Block: React.FC<BlockProps> = ({ data, isSelected, onClick }) => {
    const isFixed = data.isPrefilled;

    // Fill color
    // Amber-500 matches the orange look
    const fill = isFixed ? "#F59E0B" : "#FFFFFF"; // Orange vs White

    // Stroke (Border) color
    const stroke = "#F59E0B";
    const strokeWidth = isFixed ? 0 : 4; // Slightly thicker border for inputs

    // Text color
    const textColor = isFixed ? "text-white" : "text-gray-900";

    // SVG Points for a pointy-topped hexagon
    // Fitting in 100x100 viewbox with padding to avoid clipping stroke/shadow
    // Viewbox 0 0 100 100
    // Center 50,50
    // SVG Points for a pointy-topped hexagon
    // Fitting in 100x100 viewbox with padding to avoid clipping stroke/shadow
    // Viewbox 0 0 100 100
    // Center 50,50
    const points = "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5";

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative flex items-center justify-center cursor-pointer transition-transform select-none",
                "w-14 h-14 md:w-15 md:h-22",
                isSelected ? "scale-110 drop-shadow-xl z-20" : "hover:scale-105 z-10"
            )}
        >
            <svg
                viewBox="0 0 100 100"
                className={cn(
                    "absolute inset-0 w-full h-full drop-shadow-sm transition-all",
                    data.status === "incorrect" ? "filter hue-rotate-180 saturate-200" : ""
                )}
            >
                <polygon
                    points={points}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                />
            </svg>

            <span className={cn("relative text-lg md:text-xl font-bold z-10 select-none", textColor)}>
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
        <div className="flex flex-col items-center -space-y-3 md:-space-y-10 p-2"> {/* Adjusted negative spacing for smaller blocks */}
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

export default Pyramid;
