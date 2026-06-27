import { memo } from "react";
import { useAppDispatch } from "../context/context";

interface SampleListProps {
  samples: string[];
  selectedSample: string | null;
}

export const SampleList = memo(function SampleList({
  samples,
  selectedSample,
}: SampleListProps) {
  const dispatch = useAppDispatch();
  if (samples.length === 0) {
    return <p className="sample-empty">No samples found</p>;
  }
  return (
    <ul className="sample-list">
      {samples.map((name) => {
        const isActive = name === selectedSample;
        return (
          <li key={name}>
            <button
              type="button"
              className={isActive ? "sample-item active" : "sample-item"}
              title={name}
              onClick={() => dispatch({ type: "pickSample", name })}
            >
              {name}
            </button>
          </li>
        );
      })}
    </ul>
  );
});
