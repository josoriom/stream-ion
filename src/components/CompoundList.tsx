import { memo, useMemo, useState } from "react";
import type { Compound } from "../data/compounds";
import { useAppDispatch } from "../context/context";

type SortKey = "id" | "mz" | "rt";
type SortDir = "asc" | "desc";

interface CompoundListProps {
  compounds: Compound[];
  selectedLabel: string | null;
}

function sortCompounds(compounds: Compound[], key: SortKey, dir: SortDir): Compound[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...compounds].sort((a, b) => {
    if (key === "id") return a.label.localeCompare(b.label) * factor;
    return (a[key] - b[key]) * factor;
  });
}

function sortArrow(column: SortKey, key: SortKey, dir: SortDir): string {
  if (column !== key) return "";
  return dir === "asc" ? " ↑" : " ↓";
}

export const CompoundList = memo(function CompoundList({
  compounds,
  selectedLabel,
}: CompoundListProps) {
  const dispatch = useAppDispatch();
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(
    () => sortCompounds(compounds, sortKey, sortDir),
    [compounds, sortKey, sortDir],
  );

  function sortBy(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="compound-table">
      <div className="compound-head">
        <button type="button" className="compound-col id" onClick={() => sortBy("id")}>
          ID{sortArrow("id", sortKey, sortDir)}
        </button>
        <button type="button" className="compound-col mz" onClick={() => sortBy("mz")}>
          m/z{sortArrow("mz", sortKey, sortDir)}
        </button>
        <button type="button" className="compound-col rt" onClick={() => sortBy("rt")}>
          rt{sortArrow("rt", sortKey, sortDir)}
        </button>
      </div>
      <ul className="compound-list">
        {sorted.map((compound) => {
          const isActive = compound.label === selectedLabel;
          return (
            <li key={compound.label}>
              <button
                type="button"
                className={isActive ? "compound-item active" : "compound-item"}
                title={compound.label}
                onClick={() => dispatch({ type: "pickCompound", compound })}
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
