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
    question: "¿Qué hace Nikein cuando dice “1 traguito nomás”?",
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
      "¿Cuál fue el red flag más grande que Nikein ignoró en una relación?",
    options: [
      "Le hablaba a su ex “por buena onda nomás”",
      "Que no le gustaba el asado",
      "Que no le gustaba viajar",
      "Que no le gustaba el mate",
    ],
    answer: 1,
  },
  {
    question:
      "¿Cuál fue la peor decisión romántica que tomó Nikein después de dos tragos?",
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
      "¿Cuál es el motivo más probable por el que Nikein terminó una relación?",
    options: [
      "Falta de comunicación",
      "Demasiada comunicación",
      "Diferencias irreconciliables en gustos musicales",
      "Que no le gustaba el asado",
    ],
    answer: 1,
  },
  {
    question: "Si me hiciera un Tinder, ¿cuál sería mi bio?",
    options: [
      "Amante del mate y los viajes",
      "Buscando a alguien que aguante mis chistes malos",
      "Experto en asados y buen vino",
      "Fanático de la tecnología y los videojuegos",
    ],
    answer: 3,
  },
];

export default function Kahoot() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { question: string; answer: string }[]
  >([]);
  const [leaderboard, setLeaderboard] = useState<
    { playerName: string; score: number }[]
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const playerNameRef = useRef<HTMLInputElement>(null);
  const q = general[index];

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);

    const isCorrect = optionIndex === q.answer;
    if (isCorrect) setScore((s) => s + 1);

    setAnswers((a) => [
      ...a,
      { question: q.question, answer: q.options[optionIndex - 1] },
    ]);

    setTimeout(() => {
      if (index + 1 < general.length) {
        setIndex((i) => i + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1000);
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
      total: general.length,
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

  if (finished) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 ¡Fin del juego! 🎉</h1>
        <p className="text-xl">
          Tu puntaje: <strong>{score}</strong> / {general.length}
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
            placeholder="Nikein"
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
          <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard 🏆</h2>
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
      <h2 className="text-2xl font-bold mb-4 text-center">{q.question}</h2>

      <div className="grid gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i + 1)}
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
