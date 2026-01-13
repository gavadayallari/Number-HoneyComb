import { forwardRef, useEffect, useRef, useState } from "react";
import PreviewSidebar from "@/components/PreviewSidebar";

import type { GameConfigType, GameStateType } from "@/types/TGames";
import Image from "@/components/ui/image";
import FloatingText from "@/components/FloatingText";
import type { RefType } from "@/App";
import { resolveBackgroundCss } from "@/lib/utils";
import TapToStart from "@/components/TapToStart";
import ReplayScreen from "@/components/ReplayScreen";
import HintGuide from "@/components/HintGuide";
import NumberConundrumGame from "@/components/NumberConundrum/NumberConundrumGame";
import Level from "@/components/NumberConundrum/Level";
import LevelCompleted from "@/components/NumberConundrum/LevelCompleted";
import PortraitWarning from "@/components/PortraitWarning";

const GamePreview = forwardRef<
  RefType,
  {
    gameId: string;
    config: GameConfigType;
    sendDataToParent?: (status: {
      currentLevel: number;
      score: number | null;
      timePlayed: number;
      gameEnded: boolean;
      totalLevels: number;
      isLastLevel: boolean;
    }) => void;
  }
>(({ gameId, config, sendDataToParent }) => {
  const [gameState, setGameState] = useState<GameStateType>({
    isPlaying: false,
    isMuted: false,
    hasWon: false,
    hasTimeUp: false,
    timeLeft: config?.duration ?? 0,
    duration: config?.duration ?? 0,
    hasStarted: false,
  });
  const [freezeTimer, setFreezeTimer] = useState(false);
  const [firstTap, setFirstTap] = useState(true);
  const [showLevelScreen, setShowLevelScreen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [currentStars, setCurrentStars] = useState<number>(0);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [floatingText] = useState<string | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const gameGridRef = useRef<HTMLDivElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement>(
    new Audio("media/background.mp3")
  );

  const levelWinRef = useRef<HTMLAudioElement>(
    new Audio("media/level-win.webm")
  );

  const uiClickMusicRef = useRef<HTMLAudioElement>(
    new Audio("media/ui-click.webm")
  );
  const successMusicRef = useRef<HTMLAudioElement>(
    new Audio("media/success.webm")
  );


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
      successMusicRef.current?.pause();
      successMusicRef.current?.pause();
      backgroundMusicRef.current?.pause();
      successMusicRef.current = new Audio("media/success.webm");
      backgroundMusicRef.current = new Audio("media/background.mp3");
    };
  }, [config, gameId]);

  // Timer Logic
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!gameState.isPlaying || freezeTimer) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeLeft <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            // Handle Time Up
            // We need to call handleTimeUp, but since we are inside setState, 
            // we can't call external state setters easily if they depend on this one.
            // But handleTimeUp sets state too.
            // Better to just set the state here directly or use a callback ref if needed.
            // For simplicity, we set state here and rely on useEffect to trigger side effects if needed.
            // Actually, handleTimeUp is defined below. Let's just set the distinct flags.
            return {
              ...prev,
              timeLeft: 0,
              isPlaying: false,
              hasTimeUp: true,
            };
          }
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState.isPlaying, freezeTimer]);

  // Effect to handle Time Up Side Effects (Audio, etc)
  useEffect(() => {
    if (gameState.hasTimeUp && !gameState.hasWon) {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
      // Any other time-up logic
    }
  }, [gameState.hasTimeUp, gameState.hasWon]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // App went to background: pause all audio
        if (
          backgroundMusicRef.current &&
          !backgroundMusicRef.current.paused
        ) {
          backgroundMusicRef.current.pause();
        }

        if (uiClickMusicRef.current && !uiClickMusicRef.current.paused) {
          uiClickMusicRef.current.pause();
        }
        if (successMusicRef.current && !successMusicRef.current.paused) {
          successMusicRef.current.pause();
        }

        if (levelWinRef.current && !levelWinRef.current.paused) {
          levelWinRef.current.pause();
        }
      } else {
        // App came back to foreground: resume background music
        // only if the game is still playing and not muted
        if (
          !gameState.isMuted &&
          gameState.isPlaying &&
          backgroundMusicRef.current
        ) {
          backgroundMusicRef.current
            .play()
            .catch(() => {
              // ignore autoplay errors
            });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gameState.isMuted, gameState.isPlaying]);
  // Report game status to parent (e.g., Flutter) for this single-level demo game
  useEffect(() => {
    if (!sendDataToParent) return;

    // For this demo, we treat it as a single-level game
    const totalLevels = 1;
    const currentLevel = 1;
    const isLastLevel = true;

    const duration = gameState.duration || config?.duration || 0;
    const timeLeft = gameState.timeLeft ?? duration;
    const timePlayed = Math.max(0, duration - timeLeft);

    // Simple score: 1 if player has won, otherwise 0
    const score = gameState.hasWon ? 1 : 0;

    const gameEnded = gameState.hasWon || gameState.hasTimeUp;

    sendDataToParent({
      currentLevel,
      score,
      timePlayed,
      gameEnded,
      totalLevels,
      isLastLevel,
    });
  }, [
    sendDataToParent,
    gameState.duration,
    gameState.timeLeft,
    gameState.hasWon,
    gameState.hasTimeUp,
    config?.duration,
  ]);



  const handleResetGame = () => {
    setFreezeTimer(false);
    setShowLevelScreen(false);
    setGameKey((prev) => prev + 1);
    setGameState((prev) => ({
      isPlaying: false,
      isMuted: prev.isMuted,
      hasWon: false,
      hasTimeUp: false,
      timeLeft: config?.duration ?? 0,
      duration: config?.duration ?? 0,
      hasStarted: false,
    }));
  };
  useEffect(() => {
    const handleUiClick = () => {
      if (!gameState.isMuted && uiClickMusicRef.current) {
        uiClickMusicRef.current.play();
      }
    };
    window.addEventListener("click", handleUiClick);
    return () => {
      window.removeEventListener("click", handleUiClick);
    };
  }, [gameState]);

  const startGame = () => {
    if (!gameState.isMuted && backgroundMusicRef.current) {
      backgroundMusicRef.current.play();
      backgroundMusicRef.current.loop = true;
    }
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      hasStarted: true,
      timeLeft: config?.duration || 0,
      duration: config?.duration || 0,
    }));
  };

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    setShowLevelScreen(false);
    startGame();
  };

  const togglePause = () => {
    if (
      !gameState.isPlaying &&
      !gameState.isMuted &&
      backgroundMusicRef.current
    ) {
      backgroundMusicRef.current.play();
    } else {
      backgroundMusicRef.current?.pause();
    }
    setGameState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const toggleMute = () => {
    if (!gameState.isMuted && backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    } else if (gameState.isPlaying && backgroundMusicRef.current) {
      backgroundMusicRef.current.play();
    }
    setGameState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleWin = (stars: number) => {
    setFreezeTimer(true);
    setCurrentStars(stars);
    setLevelStars(prev => ({ ...prev, [currentLevel]: stars }));

    if (
      !gameState.isMuted &&
      backgroundMusicRef.current &&
      successMusicRef.current
    ) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      successMusicRef.current.play();
      successMusicRef.current.addEventListener("ended", () => {
        // Removed clap logic
      });
    }
    // playBigConfetti(); // Removed as requested
    // Removed specific Congratulations text as requested
    setTimeout(() => {
      setGameState((prev) => ({ ...prev, isPlaying: false, hasWon: true }));
      setFreezeTimer(false);
    }, 1000);
  };

  if (showSplashScreen) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Image
          src="images/eklavya.png"
          alt="eklavya - making learning accessible"
          className="w-full h-full object-contain animate-fade-in"
        />
      </div>
    );
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      ref={gameGridRef}
      className="game-preview-container"
      style={{
        backgroundImage: resolveBackgroundCss(config?.background, gameId),
        backgroundSize: "cover",
        backgroundPosition: "bottom center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div ref={gameGridRef}>
        <PortraitWarning />

        <div className="w-full h-full flex items-center justify-center">
          {!firstTap && !showLevelScreen && (
            <NumberConundrumGame
              key={gameKey}
              onWin={handleWin}
              isPaused={!gameState.isPlaying}
              level={currentLevel}
              timeLeft={gameState.timeLeft}
              gameName="Number Honeycomb"
            />
          )}
        </div>

      </div>

      <TapToStart
        firstTap={firstTap}
        setFirstTap={setFirstTap}
        handleStartGame={startGame}
      />

      {showLevelScreen && (
        <Level onLevelSelect={handleLevelSelect} levelStars={levelStars} />
      )}

      {/* Countdown Removed - Logic moved to GamePreview / UI to NumberConundrumGame */}

      {!firstTap && !showLevelScreen && !gameState.hasWon && (
        <PreviewSidebar
          resetGame={handleResetGame}
          showRestartButton={config?.showRestartButton ?? true}
          gameState={gameState}
          setGameState={setGameState}
          togglePause={togglePause}
          toggleMute={toggleMute}
        />
      )}

      {/* Level Completed Screen on Win */}
      {gameState.hasWon && (
        <LevelCompleted
          level={currentLevel}
          stars={currentStars}
          onNextLevel={() => {
            handleResetGame();
            setShowLevelScreen(true);
          }}
        />
      )}

      {/* Replay Screen only for Time Up (or modify if we want it for other things, but Win is handled above) */}
      {!gameState.hasWon && (
        <ReplayScreen
          type={gameState.hasTimeUp ? "timeUp" : ""}
          handleResetGame={handleResetGame}
          setGameState={setGameState}
        />
      )}
      {/* Instructions Dialog */}
      {!firstTap && !showLevelScreen && !gameState.hasWon && (
        <HintGuide
          gameState={gameState}
          setGameState={setGameState}
          play={() => {
            if (!gameState.isMuted && backgroundMusicRef.current) {
              backgroundMusicRef.current.play();
            }
          }}
          hint={""}
        />
      )}
      <FloatingText message={floatingText} />

      {/* Global Logo/Button as requested */}
      <img
        src="/images/Button→SVG-landscpae.png"
        alt="Landscape Button"
        className="fixed bottom-4 right-4 w-12 md:w-12 h-auto z-[100] cursor-pointer"
        onClick={toggleFullScreen}
      />

    </div>
  );
});

export default GamePreview;
