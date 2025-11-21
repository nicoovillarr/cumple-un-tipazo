import { useEffect, useState, useRef, useCallback } from "react";
import PartyEffects from "./PartyEffects";

const SONG_URL = "/satisfaction.wav";
const INACTIVITY_TIMEOUT_MS = 500;
const MAX_VOLUME = 1;

export default function ClickTheDrink() {
  const [leaderboard, setLeaderboard] = useState<
    { playerName: string; count: number }[]
  >([]);

  const playerNameRef = useRef<HTMLInputElement | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(true);

  const [count, setCount] = useState(0);
  const [icons, setIcons] = useState<string[]>(["🍺", "🍷", "🍸", "🍹", "🍾"]);

  const [playQueue, setPlayQueue] = useState<number>(0);
  const [strike, setStrike] = useState<number>(0);

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);

  const strikeScaleClass = `scale-[${Math.min(1 + strike * 0.05, 5)}]`;

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();

      setIsAudioPlaying(false);
      setPlayQueue(0);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      console.log("Audio cortado por inactividad. Cola vaciada.");
      setStrike(0);
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(SONG_URL);
      audioRef.current.volume = MAX_VOLUME;

      const handleEnded = () => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = 0;

        setIsAudioPlaying(false);
      };

      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", handleEnded);
        }

        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (playQueue > 0 && !isAudioPlaying && audio) {
      setIsAudioPlaying(true);

      setPlayQueue((q) => q - 1);

      audio.play().catch((error) => {
        console.error("Error al iniciar reproducción:", error);

        setIsAudioPlaying(false);
      });
    }
  }, [playQueue, isAudioPlaying]);

  useEffect(() => {
    fetch("/api/click-the-drink?limit=10")
      .then((r) => r.json())
      .then((data) => {
        setLeaderboard(data.leaderboard);
      });
  }, []);

  const handleClick = () => {
    setCount((c) => c + 1);
    setStrike((s) => s + 1);

    audioRef.current!.volume = Math.min(MAX_VOLUME, strike * 0.01);

    setPlayQueue((q) => q + 1);

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      stopAudio();
    }, INACTIVITY_TIMEOUT_MS) as unknown as number;
  };

  const saveGame = () => {
    const inputName = playerNameRef.current?.value;
    const name =
      inputName && inputName.trim().length > 0
        ? inputName.trim()
        : prompt("Poné tu nombre cabezón:", "");

    if (!name || name.trim().length === 0) {
      return;
    }

    fetch("/api/click-the-drink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerName: name.trim(), count }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          alert(`${count} puntos guardados para ${name}!`);
          setLeaderboard((prev) =>
            [...prev, { playerName: name.trim(), count }]
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
          );
        } else {
          alert("Error al guardar el puntaje. Intentá de nuevo más tarde.");
        }
      });
  };

  return (
    <main className="w-screen h-screen overflow-hidden grid place-items-center">
      <PartyEffects intensity={strike} />
      <div
        className={`relative transition-transform duration-100 ease-out select-none`}
        style={{
          scale: Math.min(1 + strike * 0.01, 5),
        }}
      >
        <p
          className={`absolute -top-1 -right-1 text-xl font-bold aspect-square bg-white text-purple-600 grid place-items-center rounded-full ${
            count < 10 ? "w-8" : "w-10"
          }`}
        >
          {count}
        </p>

        <button
          onClick={handleClick}
          className="text-8xl active:scale-95 hover:scale-110 transition-transform duration-150 focus:outline-none cursor-pointer"
        >
          {icons[count % icons.length]}
        </button>
      </div>

      <aside
        className={`absolute top-4 left-4 bg-purple-950 p-8 rounded-xl ${
          showLeaderboard ? "" : "w-8 h-8 overflow-hidden"
        } transition-all duration-500 ease-in-out`}
      >
        {!showLeaderboard && (
          <button
            className="absolute text-4xl inset-0 -mt-2 cursor-pointer hover:scale-110 active:scale-90"
            onClick={() => setShowLeaderboard(true)}
          >
            +
          </button>
        )}

        {showLeaderboard && (
          <>
            <button
              className="absolute top-2 right-2 text-white font-bold"
              onClick={() => setShowLeaderboard(false)}
            >
              X
            </button>
            <div>
              <label htmlFor="playerName" className="block font-bold mb-2">
                Guardá tu puntaje:
              </label>
              <input
                ref={playerNameRef}
                id="playerName"
                type="text"
                placeholder="Nikein"
                className="mb-4 p-2 rounded w-full text-black placeholder:text-gray-400 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                onClick={saveGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Guardar
              </button>
            </div>

            <hr className="my-4 border-purple-700" />

            <h2 className="text-2xl font-bold mb-2">Top Puntajes</h2>

            {leaderboard.length === 0 ? (
              <p>No hay scores aún. Sé el primero en jugar!</p>
            ) : (
              <ol className="list-decimal list-inside space-y-1">
                {leaderboard.map((entry, index) => (
                  <li key={index} className="text-lg">
                    {index == 0
                      ? "🥇"
                      : index == 1
                      ? "🥈"
                      : index == 2
                      ? "🥉"
                      : ""}{" "}
                    {entry.playerName}: {entry.count}
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </aside>
    </main>
  );
}
