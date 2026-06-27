import { memo, useEffect, useState } from "react";
import { useAppState } from "../context/context";

interface Memory {
  used: number;
  limit: number;
}

function readMemory(): Memory | null {
  const perf = performance as Performance & {
    memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
  };
  if (!perf.memory) return null;
  return {
    used: perf.memory.usedJSHeapSize,
    limit: perf.memory.jsHeapSizeLimit,
  };
}

export const RamMeter = memo(function RamMeter() {
  const workerMemory = useAppState().imageProgress?.memory ?? null;
  const [main, setMain] = useState<Memory | null>(readMemory);

  useEffect(() => {
    const id = window.setInterval(() => setMain(readMemory()), 500);
    return () => window.clearInterval(id);
  }, []);

  const used = workerMemory ?? main?.used ?? null;
  const limit = main?.limit ?? null;
  if (used === null || limit === null) return null;

  const usedMb = Math.round(used / 1048576);
  const limitMb = Math.round(limit / 1048576);
  const percent = Math.min(100, Math.round((used / limit) * 100));
  const over = used > limit;

  return (
    <div className="ram-meter">
      <div className="ram-meter-bar">
        <div
          className={over ? "ram-meter-fill over" : "ram-meter-fill"}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="ram-meter-label">
        RAM {usedMb} / {limitMb} MB
      </span>
    </div>
  );
});
