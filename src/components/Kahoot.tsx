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

  // 🔥 Preguntas mejoradas / más divertidas

  {
    question: "¿Qué hace Nico cuando dice '1 traguito nomás'?",
    options: [
      "Media botella después está hablando inglés fluido",
      "Termina contando la vez que quiso armar un servidor DNS en la casa",
      "Se convierte en Akali en la vida real",
      "Pide un Uber a Cancún",
    ],
    answer: 2,
  },
  {
    question: "¿Cuál sería el peor castigo del Kahoot?",
    options: [
      "Cantar una canción de cuna a Nico",
      "Shot de fernet sin coca",
      "Karaoke acapella de una canción de reguetón",
      "Contarle un chiste malo a Nico",
    ],
    answer: 1,
  },
  {
    question:
      "¿Cuál fue el red flag más grande que Nico ignoró en una relación?",
    options: [
      "Le hablaba a su ex 'por buena onda nomás'",
      "Que no le gustaba el asado",
      "Que no le gustaba viajar",
      "Que no le gustaba el mate",
    ],
    answer: 1,
  },
  {
    question:
      "¿Cuál fue la peor decisión romántica que tomó Nico después de dos tragos?",
    options: [
      "Mandarle un mensaje a su ex",
      "Ir a buscar a su ex a la casa",
      "Terminar la noche con alguien que conoció esa misma noche",
      "Decir que estaba bien cuando claramente no lo estaba",
    ],
    answer: 1,
  },
  {
    question:
      "¿Cuál es el motivo más probable por el que Nico terminó una relación?",
    options: [
      "Falta de comunicación",
      "Demasiada comunicación",
      "Diferencias irreconciliables en gustos musicales",
      "Que no le gustaba el asado",
    ],
    answer: 1,
  },
  {
    question: "Si Nico se hiciera un Tinder, ¿cuál sería su bio?",
    options: [
      "Amante del mate y los viajes",
      "Buscando a alguien que aguante mis chistes malos",
      "Desarrollador de día, fiestero de noche",
      "Fanático de la tecnología y los videojuegos",
    ],
    answer: 3,
  },

  // 🔥 NUEVAS PREGUNTAS PICANTES

  {
    question: "¿Qué hace Nico cuando dice 'hoy no tomo mucho'?",
    options: [
      "Se toma un agua mineral y se va a dormir temprano",
      "Despierta en lo de un amigo con un fernet abierto",
      "Compra hielo como para un casamiento",
      "Termina dando consejos amorosos a desconocidos",
    ],
    answer: 3,
  },
  {
    question: "¿Cuál es el toxic trait más fuerte de Nico?",
    options: [
      "Se desaparece como si tuviera modo fantasma",
      "Se enamora más rápido que un proyecto que no compila",
      "Discute como si fuera un PR de GitHub",
      "Cree que puede arreglar a la gente como si fueran bugs",
    ],
    answer: 4,
  },
  {
    question: "¿Cuál es la peor señal de que Nico está por volver con su ex?",
    options: [
      "Follow misterioso a las 03:27",
      "Historia con canción triste",
      "Un traguito 'tranqui'",
      "Dice 'estoy bien, posta'",
    ],
    answer: 2,
  },
  {
    question: "¿Cómo reacciona Nico cuando le dicen 'venite a la joda'?",
    options: [
      "Dice que no puede… y cae igual",
      "Abre el fernet en plena call",
      "Dice 'una horita más' y aparece 4 horas después",
      "Cierra la laptop sin guardar",
    ],
    answer: 2,
  },
  {
    question: "¿Qué es lo que más lo hace enojar en una relación?",
    options: [
      "Que respondan 'ok.'",
      "Que le digan que 'es solo un jueguito'",
      "Que le mientan",
      "Que odien el fernet",
    ],
    answer: 3,
  },
  {
    question: "¿Cuál es la señal más fuerte de que Nico está enamorado?",
    options: [
      "Deja de ghostear",
      "Cocina algo que no sea arroz",
      "No piensa en su ex por 72 horas",
      "Mira una peli sin abrir VSCode",
    ],
    answer: 1,
  },
  {
    question: "¿Qué promete Nico cuando está borracho?",
    options: [
      "Que va a cambiar",
      "Que va a emprender 4 empresas nuevas",
      "Que va a volver al gym",
      "Todo lo anterior",
    ],
    canShuffle: false,
    answer: 4,
  },
  {
    question: "¿Qué hace Nico cuando está triste?",
    options: [
      "Habla con un amigo",
      "Compra un gadget innecesario",
      "Reinstala su vida como si fuera Windows",
      "Reinstala Tinder 'para ver qué onda'",
    ],
    answer: 1,
  },
  {
    question: "¿Cuál es el hobby más peligroso de Nico?",
    options: [
      "Tocar el código a las 3 am",
      "Leer mensajes viejos",
      "Decir 'no me voy a enganchar'",
      "Todas las anteriores",
    ],
    canShuffle: false,
    answer: 4,
  },
  {
    question: "¿Qué frase usaría Nico para chamuyar?",
    options: [
      "¿Tomamos un mate?",
      "¿Querés ser mi variable constante?",
      "Estás más linda que cuando te stalkeé ayer",
      "Si te caigo bien sobrio, esperá a verme borracho",
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
      </div>
    </div>
  );
}
