interface TapToStartProps {
  firstTap: boolean;
  setFirstTap: React.Dispatch<React.SetStateAction<boolean>>;
  handleStartGame: () => void;
}

const TapToStart = ({
  firstTap,
  setFirstTap,
  handleStartGame
}: TapToStartProps) => {
  return firstTap ? (
    <div
      className="do-no-capture fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundImage: "url('/images/backgound-game.png')" }}
    >
      <img
        src="images/Game-name-start.png"
        alt="Game Name"
        className="w-80 md:w-[600px] object-contain mb-15 mt-[-150px] drop-shadow-xl"
      />
      <img
        src="images/Start-button.png"
        alt="Tap to start"
        onClick={(e) => {
          e.stopPropagation();
          setFirstTap(false);
          handleStartGame();
        }}
        className="w-48 md:w-64 mt-15 cursor-pointer hover:scale-105 transition-transform"
      />
      <div className="mt-20 mb-[-100px]">
        <h1 className="text-2xl font-bold text-center">
          How to Play:</h1>
        <p className="text-center font-medium mt-2">
          The Intergalactic Space Games are held each year on Planet Fraction.<br />
          Athletes on the same team wear uniforms with matching values.
        </p>
      </div>
    </div>
  ) : null;
};

export default TapToStart;