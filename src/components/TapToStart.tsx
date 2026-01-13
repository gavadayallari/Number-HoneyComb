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
      className="do-no-capture tap-to-start-container fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-bottom bg-no-repeat p-4"
      style={{ backgroundImage: "url('/images/backgound-game.png')" }}
    >
      <div className="flex flex-col items-center justify-center gap-8 md:gap-12 w-full max-w-4xl">
        <img
          src="images/Game-name-start.png"
          alt="Game Name"
          className="w-[80%] max-w-[300px] md:max-w-[600px] object-contain drop-shadow-xl animate-in fade-in zoom-in duration-500"
        />

        <img
          src="images/Start-button.png"
          alt="Tap to start"
          onClick={(e) => {
            e.stopPropagation();
            setFirstTap(false);
            handleStartGame();
          }}
          className="w-48 md:w-64 cursor-pointer hover:scale-105 active:scale-95 transition-transform drop-shadow-lg"
        />

        <div className="text-center max-w-md px-4 mt-16">
          <h1 className="text-xl md:text-2xl font-bold text-black mb-2">
            How to Play:
          </h1>
          <p className="text-sm md:text-base font-medium text-black/80 leading-relaxed">
            The Intergalactic Space Games are held each year on Planet Fraction. Athletes on the same team wear uniforms with matching values.
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

export default TapToStart;