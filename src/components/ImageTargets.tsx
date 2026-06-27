import { memo, useState } from "react";
import { useAppDispatch, useAppState } from "../context/context";
import { imageKey } from "../data/imageTargets";
import { selectView } from "../context/reducer";

export const ImageTargets = memo(function ImageTargets() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const url = selectView(state).url;
  const [mzText, setMzText] = useState("");

  function addTarget() {
    const mz = Number(mzText);
    if (!Number.isFinite(mz) || mz <= 0) return;
    dispatch({ type: "addImageTarget", mz });
    setMzText("");
  }

  return (
    <div className="config-panel">
      <div className="config-title">Add m/z target</div>
      <div className="config-explore">
        <input
          type="number"
          step="0.0001"
          placeholder="m/z"
          value={mzText}
          onChange={(event) => setMzText(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && addTarget()}
        />
        <button type="button" className="run-button" onClick={addTarget}>
          Add
        </button>
      </div>

      <div className="config-title">Targets</div>
      <ul className="image-target-list">
        {state.imageTargets.map((target) => {
          const isActive = target.mz === state.selectedMz;
          const isReady = url
            ? state.images[imageKey(url, target.mz)]?.status === "ok"
            : false;
          return (
            <li key={target.id} className="image-target-row">
              <button
                type="button"
                className={isActive ? "image-target-pick active" : "image-target-pick"}
                onClick={() => dispatch({ type: "selectImageTarget", mz: target.mz })}
              >
                <span className="image-target-mz">m/z {target.mz}</span>
                {isReady && <span className="image-target-ready" title="Already computed" />}
              </button>
              <button
                type="button"
                className="image-target-remove"
                title="Remove target"
                onClick={() => dispatch({ type: "removeImageTarget", mz: target.mz })}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
