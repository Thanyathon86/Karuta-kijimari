import { useCallback, useEffect, useRef, useState } from 'react';

/** นาฬิกาจับเวลา: start() เริ่มนับ, stop() หยุดค้างเวลาไว้, reset() กลับเป็น 0 */
export function useKarutaTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(Date.now() - startedAt.current), 100);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    startedAt.current = Date.now();
    setElapsed(0);
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setElapsed(Date.now() - startedAt.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setElapsed(0);
    setRunning(false);
  }, []);

  return { elapsed, running, start, stop, reset };
}

/** 83456 ms → "01:23.4" */
export function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  return `${mm}:${ss}.${Math.floor((ms % 1000) / 100)}`;
}
