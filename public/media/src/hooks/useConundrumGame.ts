import { useState, useCallback, useEffect } from "react";

export type Difficulty = "1-50" | "1-100";

export interface BlockData {
  value: string; // User input or prefilled value. Empty string if empty.
  isPrefilled: boolean;
  status: "normal" | "correct" | "incorrect" | "highlighted";
  correctValue: number; // The actual correct answer
}

export interface GameState {
  grid: BlockData[][]; // Row 0 is top, Row N-1 is bottom
  selectedBlock: { r: number; c: number } | null;
  difficulty: Difficulty;
  isComplete: boolean;
}

// Calculation to keep top number roughly within range:
// 5 rows (coeffs 1,4,6,4,1 sum=16). MaxBase 3 => 3*16 = 48 (approx).
// 6 rows (coeffs 1,5,10,10,5,1 sum=32). MaxBase 3 => 3*32 = 96 (approx).
const DIFFICULTY_CONFIG = {
  "1-50": { rows: 6, maxBaseNumber: 3, prefilledCount: 6 },
  "1-100": { rows: 6, maxBaseNumber: 3, prefilledCount: 6 }, // Keeping 1-100 same or increasing? User asked "jo 5 row hai 6 row kardo", implying default. Let's make 1-50 have 6 rows.
};

export const useConundrumGame = (initialDifficulty: Difficulty = "1-50") => {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    selectedBlock: null,
    difficulty: initialDifficulty,
    isComplete: false,
  });

  const generateLevel = useCallback((difficulty: Difficulty) => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const rows = config.rows;
    const solutionGrid: number[][] = [];

    // 1. Generate bottom row first (index rows-1)
    const bottomRow: number[] = [];
    for (let c = 0; c < rows; c++) {
      bottomRow.push(Math.floor(Math.random() * config.maxBaseNumber) + 1);
    }
    // Initialize solutionGrid with placeholders
    for (let r = 0; r < rows; r++) {
      solutionGrid.push(new Array(r + 1).fill(0));
    }
    // Place bottom row
    solutionGrid[rows - 1] = bottomRow;

    // 2. Calculate upwards
    for (let r = rows - 2; r >= 0; r--) {
      const currentRowLength = r + 1;
      const nextRow = solutionGrid[r + 1];
      const currentRow = [];

      for (let c = 0; c < currentRowLength; c++) {
        const val = nextRow[c] + nextRow[c + 1];
        currentRow.push(val);
      }
      solutionGrid[r] = currentRow;
    }

    // 3. Determine which blocks to show
    // Collect all coordinates
    const allCoords: { r: number, c: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= r; c++) {
        allCoords.push({ r, c });
      }
    }

    // Always show top block (0,0)
    const prefilledSet = new Set<string>();
    prefilledSet.add("0,0");

    // Randomly pick (prefilledCount - 1) more distinct blocks
    while (prefilledSet.size < config.prefilledCount) {
      const randomIndex = Math.floor(Math.random() * allCoords.length);
      const coord = allCoords[randomIndex];
      // Ensure we don't pick top block again (though Set handles duplicates, we need to pick valid others)
      prefilledSet.add(`${coord.r},${coord.c}`);
    }

    const gameGrid: BlockData[][] = solutionGrid.map((row, rIndex) => {
      return row.map((val, cIndex) => {
        const isPrefilled = prefilledSet.has(`${rIndex},${cIndex}`);

        return {
          value: isPrefilled ? val.toString() : "",
          isPrefilled: isPrefilled,
          status: "normal",
          correctValue: val
        };
      });
    });

    setGameState({
      grid: gameGrid,
      selectedBlock: null,
      difficulty,
      isComplete: false,
    });
  }, []);

  // Initial load
  useEffect(() => {
    generateLevel(initialDifficulty);
  }, [initialDifficulty, generateLevel]);

  const selectBlock = (r: number, c: number) => {
    // Only selectable if not prefilled
    if (gameState.grid[r][c].isPrefilled) return;

    setGameState((prev) => ({
      ...prev,
      selectedBlock: { r, c },
      grid: prev.grid.map((row) => row.map(b => ({ ...b, status: b.status === 'highlighted' ? 'normal' : b.status }))) // Clear previous highlights if we want single select
      // Actually, we'll handle highlighting in render or just update state here
    }));
  };

  const inputNumber = (num: string) => {
    if (!gameState.selectedBlock) return;
    const { r, c } = gameState.selectedBlock;

    setGameState((prev) => {
      const newGrid = [...prev.grid];
      const currentVal = newGrid[r][c].value;

      // Basic logic to append number, limit length if needed (e.g. 3 chars)
      if (currentVal.length >= 3) return prev;

      newGrid[r][c] = {
        ...newGrid[r][c],
        value: currentVal + num,
        status: "normal" // Reset status on edit
      };

      return { ...prev, grid: newGrid };
    });
  };

  const backspace = () => {
    if (!gameState.selectedBlock) return;
    const { r, c } = gameState.selectedBlock;

    setGameState((prev) => {
      const newGrid = [...prev.grid];
      const currentVal = newGrid[r][c].value;

      newGrid[r][c] = {
        ...newGrid[r][c],
        value: currentVal.slice(0, -1),
        status: "normal"
      };

      return { ...prev, grid: newGrid };
    });
  };

  const checkSolution = () => {
    let allCorrect = true;

    const newGrid = gameState.grid.map(row =>
      row.map(block => {
        if (block.isPrefilled) return block;

        const userVal = parseInt(block.value);
        // Check if empty
        if (block.value === "") {
          allCorrect = false;
          return { ...block, status: "incorrect" as const };
        }

        if (userVal === block.correctValue) {
          return { ...block, status: "correct" as const };
        } else {
          allCorrect = false;
          return { ...block, status: "incorrect" as const };
        }
      })
    );

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      isComplete: allCorrect
    }));

    return allCorrect;
  };

  const resetGame = () => {
    generateLevel(gameState.difficulty);
  }

  return {
    gameState,
    selectBlock,
    inputNumber,
    backspace,
    checkSolution,
    resetGame,
    setDifficulty: (d: Difficulty) => generateLevel(d)
  };
};
