import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PartyEffectsProps {
  intensity: number; // strike
}

interface Effect {
  id: number;
  type: "flash" | "blob";
  size: number;
  x: number;
  y: number;
  color: string;
  duration: number;
}

export default function PartyEffects({ intensity }: PartyEffectsProps) {
  const [effects, setEffects] = useState<Effect[]>([]);

  useEffect(() => {
    if (intensity <= 0) {
      setEffects([]);
      return;
    }

    const chance = Math.min(0.05 + intensity * 0.005, 0.5);

    const interval = setInterval(() => {
      if (Math.random() < chance) {
        spawnEffect();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [intensity]);

  function spawnEffect() {
    const id = Math.random();

    const isFlash = Math.random() < 0.2;

    if (isFlash) {
      const effect: Effect = {
        id,
        type: "flash",
        size: 0,
        x: 0,
        y: 0,
        color: "white",
        duration: 150,
      };

      setEffects((p) => [...p, effect]);
      setTimeout(() => removeEffect(id), effect.duration);
      return;
    }

    const colors = ["#ff0080", "#00eaff", "#ffea00", "#ff00ff", "#00ff88"];

    const effect: Effect = {
      id,
      type: "blob",
      size: 80 + Math.random() * 200,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 600 + intensity * 10,
    };

    setEffects((p) => [...p, effect]);
    setTimeout(() => removeEffect(id), effect.duration);
  }

  function removeEffect(id: number) {
    setEffects((p) => p.filter((e) => e.id !== id));
  }

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {effects.map((e) =>
        e.type === "flash" ? (
          <div
            key={e.id}
            className="fixed inset-0 bg-white animate-pulse"
            style={{
              opacity: 0.5,
              mixBlendMode: "screen",
              transition: "opacity 150ms linear",
            }}
          />
        ) : (
          <div
            key={e.id}
            className="absolute rounded-full blur-3xl"
            style={{
              width: e.size,
              height: e.size,
              background: e.color,
              top: `${e.y}%`,
              left: `${e.x}%`,
              opacity: 0.15 + intensity * 0.01,
              transform: `translate(-50%, -50%)`,
              transition: `opacity ${e.duration}ms linear`,
            }}
          />
        )
      )}
    </div>
  );
}
