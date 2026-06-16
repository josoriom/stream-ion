import { memo, useMemo, useState } from "react";
import type { Compound } from "../data/compounds";
import { useAppDispatch } from "../context/context";

type SortKey = "id" | "mz" | "rt";
type SortDir = "asc" | "desc";

interface CompoundListProps {
  compounds: Compound[];
  selected_label: string | null;
}

function sort_compounds(compounds: Compound[], key: SortKey, dir: SortDir): Compound[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...compounds].sort((a, b) => {
    if (key === "id") return a.label.localeCompare(b.label) * factor;
    return (a[key] - b[key]) * factor;
  });
}

function sort_arrow(column: SortKey, key: SortKey, dir: SortDir): string {
  if (column !== key) return "";
  return dir === "asc" ? " ↑" : " ↓";
}

export const CompoundList = memo(function CompoundList({
  compounds,
  selected_label,
}: CompoundListProps) {
  const dispatch = useAppDispatch();
  const [sort_key, set_sort_key] = useState<SortKey>("id");
  const [sort_dir, set_sort_dir] = useState<SortDir>("asc");

  const sorted = useMemo(
    () => sort_compounds(compounds, sort_key, sort_dir),
    [compounds, sort_key, sort_dir],
  );

  function sort_by(key: SortKey) {
    if (key === sort_key) {
      set_sort_dir(sort_dir === "asc" ? "desc" : "asc");
    } else {
      set_sort_key(key);
      set_sort_dir("asc");
    }
  }

  return (
    <div className="compound-table">
      <div className="compound-head">
        <button type="button" className="compound-col id" onClick={() => sort_by("id")}>
          ID{sort_arrow("id", sort_key, sort_dir)}
        </button>
        <button type="button" className="compound-col mz" onClick={() => sort_by("mz")}>
          m/z{sort_arrow("mz", sort_key, sort_dir)}
        </button>
        <button type="button" className="compound-col rt" onClick={() => sort_by("rt")}>
          rt{sort_arrow("rt", sort_key, sort_dir)}
        </button>
      </div>
      <ul className="compound-list">
        {sorted.map((compound) => {
          const is_active = compound.label === selected_label;
          return (
            <li key={compound.label}>
              <button
                type="button"
                className={is_active ? "compound-item active" : "compound-item"}
                title={compound.label}
                onClick={() => dispatch({ type: "pick_compound", compound })}
              >
                <span className="compound-id">{compound.label}</span>
                <span className="compound-mz">{compound.mz}</span>
                <span className="compound-rt">{compound.rt}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
