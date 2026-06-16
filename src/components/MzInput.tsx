import { memo } from "react";
import { useAppDispatch } from "../context/context";

interface MzInputProps {
  value: string;
}

export const MzInput = memo(function MzInput({ value }: MzInputProps) {
  const dispatch = useAppDispatch();
  return (
    <label className="mz-input">
      <span className="mz-input-label">Target m/z</span>
      <input
        type="number"
        step="0.0001"
        value={value}
        onChange={(event) =>
          dispatch({ type: "change_mz", value: event.target.value })
        }
      />
    </label>
  );
});
