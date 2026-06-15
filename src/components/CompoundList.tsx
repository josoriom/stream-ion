import type { Compound } from '../data/compounds';

interface CompoundListProps {
  compounds: Compound[];
  selected_label: string | null;
  on_select: (compound: Compound) => void;
}

export function CompoundList({ compounds, selected_label, on_select }: CompoundListProps) {
  return (
    <ul className="compound-list">
      {compounds.map((compound) => {
        const is_active = compound.label === selected_label;
        return (
          <li key={compound.label}>
            <button
              type="button"
              className={is_active ? 'compound-item active' : 'compound-item'}
              onClick={() => on_select(compound)}
            >
              <span className="compound-name">{compound.label}</span>
              <span className="compound-meta">
                m/z {compound.mz} · rt {compound.rt}
                {compound.MF ? ` · ${compound.MF}` : ''}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
