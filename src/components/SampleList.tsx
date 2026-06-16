import { memo } from "react";
import { useAppDispatch } from "../context/context";

interface SampleListProps {
  samples: string[];
  selected_sample: string | null;
}

export const SampleList = memo(function SampleList({
  samples,
  selected_sample,
}: SampleListProps) {
  const dispatch = useAppDispatch();
  if (samples.length === 0) {
    return <p className="sample-empty">No samples found</p>;
  }
  return (
    <ul className="sample-list">
      {samples.map((name) => {
        const is_active = name === selected_sample;
        return (
          <li key={name}>
            <button
              type="button"
              className={is_active ? "sample-item active" : "sample-item"}
              title={name}
              onClick={() => dispatch({ type: "pick_sample", name })}
            >
              {name}
            </button>
          </li>
        );
      })}
    </ul>
  );
});
