import { memo, useState } from "react";
import { useAppDispatch, useAppState } from "../context/context";

export const ConfigPanel = memo(function ConfigPanel() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [explore, setExplore] = useState(state.mzText);

  return (
    <div className="config-panel">
      <div className="config-title">Configuration</div>

      <div className="config-row">
        <label className="config-field">
          <span className="config-label">Intensity</span>
          <input
            type="number"
            min={0}
            value={state.minIntensity}
            onChange={(event) =>
              dispatch({ type: "setMinIntensity", value: Number(event.target.value) })
            }
          />
        </label>
        <label className="config-field">
          <span className="config-label">Integral</span>
          <input
            type="number"
            min={0}
            value={state.minIntegral}
            onChange={(event) =>
              dispatch({ type: "setMinIntegral", value: Number(event.target.value) })
            }
          />
        </label>
        <label className="config-field">
          <span className="config-label">Width</span>
          <input
            type="number"
            min={0}
            value={state.minWidth}
            onChange={(event) =>
              dispatch({ type: "setMinWidth", value: Number(event.target.value) })
            }
          />
        </label>
        <label className="config-field">
          <span className="config-label">SNR</span>
          <input
            type="number"
            min={0}
            value={state.minSnr}
            onChange={(event) =>
              dispatch({ type: "setMinSnr", value: Number(event.target.value) })
            }
          />
        </label>
      </div>

      <div className="config-checks">
        <label className="config-check">
          <input
            type="checkbox"
            checked={state.autoNoise}
            onChange={() => dispatch({ type: "toggleAutoNoise" })}
          />
          <span>Auto noise</span>
        </label>
        <label className="config-check">
          <input
            type="checkbox"
            checked={state.autoBaseline}
            onChange={() => dispatch({ type: "toggleAutoBaseline" })}
          />
          <span>Auto baseline</span>
        </label>
        <label className="config-check">
          <input
            type="checkbox"
            checked={state.allowOverlap}
            onChange={() => dispatch({ type: "toggleAllowOverlap" })}
          />
          <span>Allow overlap</span>
        </label>
        <label className="config-check">
          <input
            type="checkbox"
            checked={state.annotate}
            onChange={() => dispatch({ type: "toggleAnnotate" })}
          />
          <span>Annotate</span>
        </label>
        <label className="config-check">
          <input
            type="checkbox"
            checked={state.displayBaseline}
            onChange={() => dispatch({ type: "toggleDisplayBaseline" })}
          />
          <span>Display baseline</span>
        </label>
        <label className="config-check">
          <input
            type="checkbox"
            checked={state.autoPeakPicking}
            onChange={() => dispatch({ type: "toggleAutoPeakPicking" })}
          />
          <span>Auto peak picking</span>
        </label>
      </div>

      <div className="config-title">EIC extraction</div>

      <div className="config-row">
        <label className="config-field">
          <span className="config-label">RT from</span>
          <input
            type="number"
            value={state.rtFrom}
            onChange={(event) =>
              dispatch({ type: "setRtFrom", value: Number(event.target.value) })
            }
          />
        </label>
        <label className="config-field">
          <span className="config-label">RT to</span>
          <input
            type="number"
            value={state.rtTo}
            onChange={(event) => dispatch({ type: "setRtTo", value: Number(event.target.value) })}
          />
        </label>
        <label className="config-field">
          <span className="config-label">ppm</span>
          <input
            type="number"
            value={state.ppm}
            onChange={(event) => dispatch({ type: "setPpm", value: Number(event.target.value) })}
          />
        </label>
        <label className="config-field">
          <span className="config-label">Da</span>
          <input
            type="number"
            step="0.001"
            value={state.mzTol}
            onChange={(event) =>
              dispatch({ type: "setMzTol", value: Number(event.target.value) })
            }
          />
        </label>
      </div>

      <div className="config-title">Explore m/z</div>

      <div className="config-explore">
        <input
          type="number"
          step="0.0001"
          value={explore}
          onChange={(event) => setExplore(event.target.value)}
        />
        <button
          type="button"
          className="run-button"
          onClick={() => dispatch({ type: "changeMz", value: explore })}
        >
          Run
        </button>
      </div>
    </div>
  );
});
