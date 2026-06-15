interface MzInputProps {
  value: string;
  on_change: (value: string) => void;
}

export function MzInput({ value, on_change }: MzInputProps) {
  return (
    <label className="mz-input">
      <span className="mz-input-label">Target m/z</span>
      <input
        type="number"
        step="0.0001"
        value={value}
        onChange={(event) => on_change(event.target.value)}
      />
    </label>
  );
}
