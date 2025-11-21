import { useEffect, useRef, useState } from "react";

interface QuestionGroup {
  title: string;
  description: string;
  questions: Question[];
}

interface Question {
  question: string;
  options: string[];
  answer: number;
  canShuffle?: boolean;
}

const general: Question[] = [
  {
    question: "¿Cuál es mi nombre completo?",
    options: [
      "Nicolás Villar Moreira",
      "Nicolás Villar Morales",
      "Nicolás Vilar Moraes",
      "Nicolás Villar Moraes",
    ],
    answer: 4,
  },
  {
    question: "¿En qué equipo de fútbol jugué cuando tenía 10 años?",
    options: ["Defensor", "Danubio", "Fénix", "Nacional"],
    answer: 3,
  },
  {
    question: "¿Cuál es mi yerba favorita?",
    options: ["Canarias Amarilla", "Canarias Serena", "Baldo", "Sara"],
    answer: 2,
  },
  {
    question: "¿Cuál es mi trago favorito?",
    options: ["Fernet con coca", "Caipirinha", "Mojito", "Caipiroska"],
    answer: 4,
  },
  {
    question: "¿Cuántas novias tuve?",
    options: ["1", "2", "3", "4"],
    answer: 4,
  },
  {
    question: "¿Qué excusa uso para no responder mensajes?",
    options: [
      "Estoy ocupado",
      "No vi el mensaje",
      "Se me olvidó",
      "Estoy trabajando",
    ],
    answer: 4,
  },
  {
    question: "¿Cuál de estos idiomas NO hablo?",
    options: ["Inglés", "Español", "Francés", "Alemán"],
    answer: 4,
  },
  {
    question: "¿En qué tier estoy del LoL?",
    options: ["Hierro", "Bronce", "Platino", "Grand Master"],
    answer: 1,
  },
  {
    question: "¿Dónde estudié en la primaria?",
    options: [
      "Sagrada Familia",
      "Corazón de María",
      "Colegio Inglés",
      "Colegio Seminario",
    ],
    answer: 1,
  },
  {
    question: "¿Dónde estudié en el liceo?",
    options: [
      "Sagrada Familia",
      "Corazón de María",
      "Colegio Inglés",
      "Colegio Seminario",
    ],
    answer: 1,
  },
  {
    question: "¿Cuál es mi helado favorito?",
    options: ["Dulce de leche", "Chocolate", "Vainilla", "Frutilla"],
    answer: 1,
  },
  {
    question: "¿Cuál fue mi primer trabajo?",
    options: ["Inetsat", "Kaizen", "TCS", "Globant"],
    answer: 1,
  },
  {
    question: "¿Cuántas materias me llevé en primero de liceo?",
    options: ["0", "1", "2", "3"],
    answer: 1,
  },
  {
    question: "¿Cómo se llaman mis gatos?",
    options: [
      "Jueza y Abogado",
      "Gris y Negro",
      "Nicki y Nicole",
      "Pedro y Pedra",
    ],
    answer: 1,
  },
  {
    question: "¿Por qué mi perra Megan se llama así?",
    options: ["Transformers", "Drake y Josh", "The Blacklist", "Hércules"],
    answer: 2,
  },
  {
    question: "¿Qué serie no terminé?",
    options: ["Breaking Bad", "Bojack Horseman", "The Walking Dead", "Lost"],
    answer: 3,
  },
  {
    question: "¿Cuál de estas NO hice nunca?",
    options: [
      "Saltar en paracaídas",
      "Tatuarme",
      "Viajar a Grecia",
      "Más de 120kg en sentadillas",
    ],
    answer: 3,
  },
  {
    question: "¿Cuántos sustos de embarazo tuve?",
    options: ["0", "1", "2", "3"],
    answer: 2,
  },
  {
    question: "¿A quién de los invitados le hice una página web?",
    options: ["Franco", "Caro", "Pantu", "Seba y Agus"],
    answer: 4,
  },
  {
    question: "¿Qué comida pediría toda mi vida sin aburrirme?",
    options: ["Pizza", "Sushi", "Hamburguesa", "Pasta"],
    answer: 3,
  },
  {
    question: "¿A dónde fui en mi último viaje?",
    options: ["Brasil", "Argentina", "España", "Francia"],
    answer: 2,
  },
  {
    question: "¿Cuántos años cumplo?",
    options: ["24", "25", "25", "31"],
    answer: 2,
  },
  {
    question: "¿Cuál es mi mayor enemigo?",
    options: ["El calor", "El LoL", "Estudiar", "Trabajar"],
    answer: 1,
  },
  {
    question: "¿A dónde quiero viajar si o si?",
    options: ["Japón", "Australia", "Nueva Zelanda", "Canadá"],
    answer: 4,
  },
  {
    question: "¿Qué es lo primero que haría si fuera millonario?",
    options: [
      "Comprar una PC",
      "Irme de viaje",
      "Comprar terrenos",
      "Renunciar po Slack",
    ],
    answer: 2,
  },
];

export default function Kahoot() {
  const shuffle = <T,>(arr: T[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const [questions, setQuestions] = useState<Question[]>(() =>
    general.map((qq) => {
      if (qq.canShuffle === false) {
        return qq;
      }

      const shuffledOptions = shuffle(qq.options);
      const originalCorrect = qq.options[qq.answer - 1];
      const newIndex = shuffledOptions.findIndex((o) => o === originalCorrect);
      return {
        ...qq,
        options: shuffledOptions,
        answer: newIndex >= 0 ? newIndex + 1 : qq.answer,
      } as Question;
    })
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [muted, setMuted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { question: string; answer: string }[]
  >([]);
  const [leaderboard, setLeaderboard] = useState<
    { playerName: string; score: number }[]
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const playerNameRef = useRef<HTMLInputElement>(null);
  const soundtrackRef = useRef<HTMLAudioElement | null>(null);
  const correctRef = useRef<HTMLAudioElement | null>(null);
  const incorrectRef = useRef<HTMLAudioElement | null>(null);
  const q = questions[index];

  useEffect(() => {
    soundtrackRef.current = new Audio("/soundtrack.mp3");
    soundtrackRef.current.loop = true;
    correctRef.current = new Audio("/correct-answer.mp3");
    incorrectRef.current = new Audio("/incorrect-answer.mp3");

    try {
      if (soundtrackRef.current) soundtrackRef.current.muted = muted;
      if (correctRef.current) correctRef.current.muted = muted;
      if (incorrectRef.current) incorrectRef.current.muted = muted;
    } catch (e) {}

    return () => {
      try {
        soundtrackRef.current?.pause();
        soundtrackRef.current = null;
        correctRef.current = null;
        incorrectRef.current = null;
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  useEffect(() => {
    try {
      if (soundtrackRef.current) soundtrackRef.current.muted = muted;
      if (correctRef.current) correctRef.current.muted = muted;
      if (incorrectRef.current) incorrectRef.current.muted = muted;
    } catch (e) {}
  }, [muted]);

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);

    const isCorrect = optionIndex === q.answer;
    if (isCorrect) setScore((s) => s + 1);

    try {
      soundtrackRef.current?.pause();
    } catch (e) {}

    const effect = isCorrect ? correctRef.current : incorrectRef.current;
    if (!muted) {
      effect?.play().catch(() => {});
    }

    setAnswers((a) => [
      ...a,
      { question: q.question, answer: q.options[optionIndex - 1] },
    ]);

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    if (selected !== null) return;

    setSelected(0);

    try {
      soundtrackRef.current?.pause();
    } catch (e) {}

    if (!muted) {
      incorrectRef.current?.play().catch(() => {});
    }

    setAnswers((a) => [
      ...a,
      { question: q.question, answer: "Sin responder" },
    ]);

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 2500);
  };

  const getButtonClass = (i: number) => {
    if (selected === null) {
      return "bg-blue-500 hover:bg-blue-600";
    }

    const isCorrect = i === q.answer;
    const isSelected = i === selected;

    if (isCorrect) return "bg-green-600";
    if (isSelected && !isCorrect) return "bg-red-600";
    return "bg-gray-600";
  };

  const saveGame = () => {
    if (submitted) return;

    const playerName = playerNameRef.current?.value || "Anonimo";
    const gameData = {
      playerName,
      score,
      total: questions.length,
      answers,
    };

    fetch("/api/kahoot-loco", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("¡Puntaje guardado con éxito!");
          setSubmitted(true);
          setLeaderboard((lb) =>
            [...lb, { playerName, score }]
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
          );
        } else {
          alert("Hubo un error al guardar el puntaje.");
        }
      });
  };

  useEffect(() => {
    fetch("/api/kahoot-loco")
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data.leaderboard);
      });
  }, []);

  useEffect(() => {
    if (finished) return;
    setSecondsLeft(30);

    try {
      if (soundtrackRef.current) {
        soundtrackRef.current.currentTime = 0;

        soundtrackRef.current.play().catch(() => {});
      }
    } catch (e) {}

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);

          setTimeout(() => handleTimeUp(), 50);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [index, finished]);

  useEffect(() => {
    if (finished) {
      try {
        soundtrackRef.current?.pause();
      } catch (e) {}
    }
  }, [finished]);

  if (finished) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 ¡Fin del juego! 🎉</h1>
        <p className="text-xl">
          Tu puntaje: <strong>{score}</strong> / {questions.length}
        </p>

        <div className="mt-6 text-left max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            ¿Querés guardar tus respuestas?
          </h2>
          <label htmlFor="playerName" className="block font-bold mb-2">
            Guardá tu puntaje:
          </label>
          <input
            ref={playerNameRef}
            id="playerName"
            type="text"
            placeholder="Nico"
            className="mb-4 p-2 rounded w-full text-black placeholder:text-gray-400 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={saveGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitted}
          >
            Guardar
          </button>
        </div>

        <div className="mt-10 max-w-md mx-auto text-left">
          <h2 className="text-2xl font-bold mb-4">🏆 Top</h2>
          <ol className="list-decimal list-inside">
            {leaderboard.map((entry, i) => (
              <li key={i} className="mb-2">
                {i == 0 ? "🥇" : i == 1 ? "🥈" : i == 2 ? "🥉" : ""}{" "}
                {entry.playerName}: {entry.score} puntos
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm">
          Tiempo: <strong>{secondsLeft}s</strong>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="px-3 py-1 rounded bg-gray-800/40 hover:bg-gray-800/60"
            aria-pressed={muted}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">{q.question}</h2>

      <div className="grid gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i + 1)}
            disabled={selected !== null}
            className={`p-3 rounded-xl text-white transition-all duration-300 ${getButtonClass(
              i + 1
            )} ${selected !== null ? "cursor-default" : "cursor-pointer"}`}
          >
            {opt}
          </button>
        ))}
        <p className="w-full text-center font-bold">
          {index} de {questions.length}
        </p>
      </div>
    </div>
  );
}
