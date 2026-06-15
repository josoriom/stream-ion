interface SampleListProps {
  samples: string[];
  selected_sample: string | null;
  on_select: (name: string) => void;
}

export function SampleList({ samples, selected_sample, on_select }: SampleListProps) {
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
              className={is_active ? 'sample-item active' : 'sample-item'}
              title={name}
              onClick={() => on_select(name)}
            >
              {name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
