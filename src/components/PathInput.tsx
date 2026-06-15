interface PathInputProps {
  path: string;
  on_change: (value: string) => void;
}

export function PathInput({ path, on_change }: PathInputProps) {
  return (
    <label className="path-input">
      <span className="path-input-label">Data folder URL</span>
      <input
        type="text"
        value={path}
        spellCheck={false}
        onChange={(event) => on_change(event.target.value)}
      />
    </label>
  );
}
