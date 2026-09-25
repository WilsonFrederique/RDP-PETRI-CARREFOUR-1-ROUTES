import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  places,
  transitions,
  initialMarking,
  getEnabledTransition,
  fire,
  getLightState,
  getPedState,
} from "../algorithms/petriEngine";

const PetriContext = createContext(null);

export function PetriProvider({ children }) {
  const [history, setHistory] = useState([initialMarking]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1600);
  const timerRef = useRef(null);

  const marking = history[index];

  const next = useCallback(() => {
    setHistory((h) => {
      const base = h[index];
      const t = getEnabledTransition(base);
      if (!t) return h;
      const nextMarking = fire(t, base);
      const truncated = h.slice(0, index + 1);
      return [...truncated, nextMarking];
    });
    setIndex((i) => i + 1);
  }, [index]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setHistory([initialMarking]);
    setIndex(0);
  }, []);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  useEffect(() => {
    if (!isPlaying) return undefined;
    timerRef.current = setInterval(() => next(), speed);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, next]);

  const enabled = getEnabledTransition(marking);

  const value = {
    places,
    transitions,
    marking,
    lightState: getLightState(marking),
    pedState: getPedState(marking),
    isPlaying,
    togglePlay,
    next,
    prev,
    reset,
    canPrev: index > 0,
    speed,
    setSpeed,
    hasNetwork: true,
    isDeadlocked: !enabled,
    activeTransition: enabled?.id ?? null,
  };

  return <PetriContext.Provider value={value}>{children}</PetriContext.Provider>;
}

export function usePetri() {
  const ctx = useContext(PetriContext);
  if (!ctx) throw new Error("usePetri() doit être appelé sous <PetriProvider>");
  return ctx;
}
