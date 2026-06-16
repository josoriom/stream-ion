import { memo } from "react";
import { useAppDispatch } from "../context/context";

interface PathInputProps {
  path: string;
}

export const PathInput = memo(function PathInput({ path }: PathInputProps) {
  const dispatch = useAppDispatch();
  return (
    <label className="path-input">
      <span className="path-input-label">Data folder URL</span>
      <input
        type="text"
        value={path}
        spellCheck={false}
        onChange={(event) =>
          dispatch({ type: "set_path", path: event.target.value })
        }
      />
    </label>
  );
});
