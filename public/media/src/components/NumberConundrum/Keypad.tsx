import React from 'react';

interface KeypadProps {
    onInput: (num: string) => void;
    onBackspace: () => void; // Keeping prop definition for compatibility but unused
}

const Keypad: React.FC<KeypadProps> = ({ onInput, onBackspace }) => {
    // Exact numbers from the user's reference image
    const row1 = ['1', '2', '3', '4', '5', '6', '7'];
    const row2 = ['8', '9', '0', '33', '17', '7', '5', '5'];

    return (
        <div className="flex flex-col items-center -space-y-4 max-w-4xl mx-auto"> {/* Negative space for honeycomb nesting effect */}

            {/* Row 1: 7 items */}
            <div className="flex justify-center gap-0 z-10">
                {row1.map((num, i) => (
                    <HexButton key={`r1-${i}`} label={num} onClick={() => onInput(num)} />
                ))}
            </div>

            {/* Row 2: 8 items + Backspace */}
            <div className="flex justify-center gap-0 z-0">
                {row2.map((num, i) => (
                    <HexButton key={`r2-${i}`} label={num} onClick={() => onInput(num)} />
                ))}
                <HexButton label="⌫" onClick={onBackspace} isAction />
            </div>

        </div>
    );
};

interface HexButtonProps {
    label: React.ReactNode;
    onClick: () => void;
    isAction?: boolean;
}

const HexButton: React.FC<HexButtonProps> = ({ label, onClick, isAction }) => {
    // Teal-500: #14B8A6
    const stroke = "#14B8A6";
    const fill = "#FFFFFF";

    // Pointy-topped hexagon points
    const points = "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5";

    return (
        <button
            onClick={onClick}
            className="relative w-16 h-16 md:w-16 md:h-16 flex items-center justify-center transition-transform active:scale-95 focus:outline-none"
        >
            <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full drop-shadow-sm"
            >
                <polygon
                    points={points}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="4"
                    strokeLinejoin="round"
                />
            </svg>
            <span className={`relative z-10 font-bold text-xl md:text-2xl ${isAction ? 'text-red-500' : 'text-gray-900'}`}>
                {label}
            </span>
        </button>
    );
};

export default Keypad;
