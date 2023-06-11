import { useState, useEffect } from "react";

export default function useDelayedRender(delay) {
  const [delayed, setDelayed] = useState(true);
  useEffect(() => {
    const timeOut = setTimeout(() => setDelayed(false), delay);
    return () => clearTimeout(timeOut);
  }, [delay]);

  return (fn) => !delayed;
}
