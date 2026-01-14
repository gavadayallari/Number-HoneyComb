import { useState, useCallback, useEffect } from "react";

export type Difficulty = "1-50" | "1-100";

export interface BlockData {
  value: string; // User input or prefilled value. Empty string if empty.
  isPrefilled: boolean;
  status: "normal" | "correct" | "incorrect" | "highlighted";
  correctValue: number; // The actual correct answer
  keypadId?: string; // ID of the keypad item currently in this block (if user filled)
}

export interface KeypadItem {
  id: string;
  value: number;
  isUsed: boolean;
}

export interface GameState {
  grid: BlockData[][]; // Row 0 is top, Row N-1 is bottom
  selectedBlock: { r: number; c: number } | null;
  difficulty: Difficulty;
  isComplete: boolean;
  stars: number;
  accuracy: number;
  keypadNumbers: KeypadItem[];
}

// Calculation to keep top number roughly within range:
// 5 rows (coeffs 1,4,6,4,1 sum=16). MaxBase 3 => 3*16 = 48 (approx).
// 6 rows (coeffs 1,5,10,10,5,1 sum=32). MaxBase 3 => 3*32 = 96 (approx).
const DIFFICULTY_CONFIG = {
  "1-50": { rows: 6, maxBaseNumber: 3, prefilledCount: 6 },
  "1-100": { rows: 6, maxBaseNumber: 3, prefilledCount: 6 },
};

export const useConundrumGame = (initialDifficulty: Difficulty = "1-50") => {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    selectedBlock: null,
    difficulty: initialDifficulty,
    isComplete: false,
    stars: 0,
    accuracy: 0,
    keypadNumbers: [],
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

    // 3. Determine which blocks to show (Prefilled)
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

    if (difficulty === "1-50") {
      // EASY MODE: Helper to pick adjacent pairs (Side-by-Side)
      // We aim for at least 2 pairs if possible to make addition easy.
      const potentialPairs: { r: number, c: number }[] = [];
      // Collect valid pairs from rows > 2 (bottom/middle rows are easier for base addition)
      for (let r = 3; r < rows; r++) {
        for (let c = 0; c < r; c++) {
          // Add left item of the pair. We will try to add (r,c) and (r,c+1)
          potentialPairs.push({ r, c });
        }
      }

      // Try to pick distinct pairs until we are close to quota
      let attempts = 0;
      while (prefilledSet.size < config.prefilledCount - 1 && attempts < 20) {
        attempts++;
        const randIdx = Math.floor(Math.random() * potentialPairs.length);
        const { r, c } = potentialPairs[randIdx];

        // Check if both spots are free
        if (!prefilledSet.has(`${r},${c}`) && !prefilledSet.has(`${r},${c + 1}`)) {
          prefilledSet.add(`${r},${c}`);
          prefilledSet.add(`${r},${c + 1}`);
        }
      }
    }

    // Fill remaining quota randomly
    while (prefilledSet.size < config.prefilledCount) {
      const randomIndex = Math.floor(Math.random() * allCoords.length);
      const coord = allCoords[randomIndex];
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

    // 4. Generate Keypad Pool
    // Collect all correct values for empty blocks
    const poolValues: number[] = [];
    gameGrid.forEach(row => {
      row.forEach(block => {
        if (!block.isPrefilled) {
          poolValues.push(block.correctValue);
        }
      });
    });

    // We have exactly 15 empty slots (21 total - 6 prefilled).
    // If poolValues < 15, fill with random distractors (shouldn't happen with current config, but safe to add)
    // If poolValues > 15, we might have an issue, but standard config is 21-6=15.
    while (poolValues.length < 15) {
      poolValues.push(Math.floor(Math.random() * 50) + 1);
    }

    // Shuffle pool
    const shuffledPool = poolValues
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item, index) => ({
        id: `key-${index}-${Date.now()}`,
        value: item.value,
        isUsed: false
      }));

    setGameState({
      grid: gameGrid,
      selectedBlock: null,
      difficulty,
      isComplete: false,
      stars: 0,
      accuracy: 0,
      keypadNumbers: shuffledPool,
    });
  }, []);

  // Initial load
  useEffect(() => {
    generateLevel(initialDifficulty);
  }, [initialDifficulty, generateLevel]);

  const selectBlock = (r: number, c: number) => {
    // Only selectable if not prefilled
    if (gameState.grid[r][c].isPrefilled) return;

    setGameState((prev) => {
      const newGrid = [...prev.grid.map(row => [...row])];
      const clickedBlock = newGrid[r][c];
      let newKeypadNumbers = [...prev.keypadNumbers];

      // "Exchange" Logic: If user clicks a filled block, return number to keypad
      if (clickedBlock.value !== "" && clickedBlock.keypadId) {
        // Return to pool
        newKeypadNumbers = newKeypadNumbers.map(k =>
          k.id === clickedBlock.keypadId ? { ...k, isUsed: false } : k
        );
        // Clear block
        newGrid[r][c] = {
          ...clickedBlock,
          value: "",
          keypadId: undefined,
          status: "normal"
        };
      }

      // If we are just selecting (or after clearing), we update status
      return {
        ...prev,
        selectedBlock: { r, c },
        grid: newGrid.map((row) => row.map(b => ({ ...b, status: b.status === 'highlighted' ? 'normal' : b.status }))),
        keypadNumbers: newKeypadNumbers
      };
    });
  };

  const handleKeypadSelect = (keypadId: string, value: number) => {
    if (!gameState.selectedBlock) return;
    const { r, c } = gameState.selectedBlock;

    setGameState((prev) => {
      const newGrid = [...prev.grid.map(row => [...row])]; // Deep copy grid
      const oldBlock = newGrid[r][c];

      // If block already has a value from keypad, return it to pool
      let newKeypadNumbers = prev.keypadNumbers.map(k => ({ ...k }));
      if (oldBlock.keypadId) {
        newKeypadNumbers = newKeypadNumbers.map(k =>
          k.id === oldBlock.keypadId ? { ...k, isUsed: false } : k
        );
      }

      // Mark selected keypad item as used
      newKeypadNumbers = newKeypadNumbers.map(k =>
        k.id === keypadId ? { ...k, isUsed: true } : k
      );

      // Update block
      newGrid[r][c] = {
        ...oldBlock,
        value: value.toString(),
        keypadId: keypadId,
        status: "normal"
      };

      return { ...prev, grid: newGrid, keypadNumbers: newKeypadNumbers };
    });
  };

  // Clears the selected block and returns value to pool
  const backspace = () => {
    if (!gameState.selectedBlock) return;
    const { r, c } = gameState.selectedBlock;

    setGameState((prev) => {
      const newGrid = [...prev.grid.map(row => [...row])];
      const oldBlock = newGrid[r][c];

      if (!oldBlock.keypadId || oldBlock.value === "") return prev;

      // Return value to pool
      const newKeypadNumbers = prev.keypadNumbers.map(k =>
        k.id === oldBlock.keypadId ? { ...k, isUsed: false } : k
      );

      // Clear block
      newGrid[r][c] = {
        ...oldBlock,
        value: "",
        keypadId: undefined,
        status: "normal"
      };

      return { ...prev, grid: newGrid, keypadNumbers: newKeypadNumbers };
    });
  };

  // Handles placing a specific keypad item into a specific block (Drag and Drop)
  const placeKeypadItem = (r: number, c: number, keypadId: string, value: number) => {
    // Basic validation
    if (r < 0 || r >= gameState.grid.length || c < 0 || c >= gameState.grid[r].length) return;
    if (gameState.grid[r][c].isPrefilled) return;

    setGameState((prev) => {
      const newGrid = [...prev.grid.map(row => [...row])];
      const oldBlock = newGrid[r][c];
      let newKeypadNumbers = prev.keypadNumbers.map(k => ({ ...k }));

      // 1. If the target block already had a value (from a keypad item), return THAT item to the pool
      if (oldBlock.keypadId) {
        newKeypadNumbers = newKeypadNumbers.map(k =>
          k.id === oldBlock.keypadId ? { ...k, isUsed: false } : k
        );
      }

      // 2. Mark the NEW keypad item as used
      newKeypadNumbers = newKeypadNumbers.map(k =>
        k.id === keypadId ? { ...k, isUsed: true } : k
      );

      // 3. Update the target block
      newGrid[r][c] = {
        ...oldBlock,
        value: value.toString(),
        keypadId: keypadId,
        status: "normal"
      };

      return {
        ...prev,
        grid: newGrid,
        keypadNumbers: newKeypadNumbers,
        selectedBlock: null // Deselect any block to avoid confusion
      };
    });
  };

  const checkSolution = () => {


    const newGrid = gameState.grid.map(row =>
      row.map(block => {
        if (block.isPrefilled) return block;

        const userVal = parseInt(block.value);
        // Check if empty
        if (block.value === "") {
          return { ...block, status: "incorrect" as const };
        }

        if (userVal === block.correctValue) {
          return { ...block, status: "correct" as const };
        } else {
          return { ...block, status: "incorrect" as const };
        }
      })
    );

    // Calculate stats based on newGrid
    const totalFillable = newGrid.reduce((acc, row) => acc + row.filter(b => !b.isPrefilled).length, 0);
    const correctCount = newGrid.reduce((acc, row) => acc + row.filter(b => !b.isPrefilled && b.status === "correct").length, 0);

    const accuracy = totalFillable > 0 ? (correctCount / totalFillable) * 100 : 0;
    let stars = 0;
    if (accuracy >= 100) stars = 3;
    else if (accuracy >= 80) stars = 2;
    else if (accuracy >= 50) stars = 1;

    // Check if grid is full
    const isGridFull = gameState.grid.every(row =>
      row.every(block => block.value !== "")
    );

    if (!isGridFull) {
      // Even if not full, we return false to indicate not won. 
      // We still update the grid to show validation for filled blocks.
      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        isComplete: false, // Ensure it doesn't complete
        stars,
        accuracy
      }));
      return false;
    }

    // Win condition: Accuracy must be at least 50% (1 star or more)
    const isWin = stars >= 1;

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      isComplete: isWin,
      stars,
      accuracy
    }));

    return isWin;
  };

  const resetGame = () => {
    generateLevel(gameState.difficulty);
  }

  return {
    gameState,
    selectBlock,
    handleKeypadSelect, // Replaced inputNumber
    backspace,
    checkSolution,
    resetGame,
    placeKeypadItem,
    setDifficulty: (d: Difficulty) => generateLevel(d)
  };
};