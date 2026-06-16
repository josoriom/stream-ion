import { compounds } from "./data/compounds";
import { get_peaks } from "./ms/peaks";
import { PathInput } from "./components/PathInput";
import { SampleList } from "./components/SampleList";
import { MzInput } from "./components/MzInput";
import { CompoundList } from "./components/CompoundList";
import { EicPlot } from "./components/EicPlot";
import { PeakTable } from "./components/PeakTable";
import { ResizeHandle } from "./components/ResizeHandle";
import { useAppDispatch, useAppState } from "./context/context";
import { select_view } from "./context/reducer";
import "./App.css";

function App() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const view = select_view(state);

  function run_peak_picking() {
    if (!view.eic_ready) return;
    const list = get_peaks(view.points);
    dispatch({ type: "peaks_found", key: `${view.url}|${view.mz}`, list });
  }

  return (
    <div className="app">
      <aside
        className={state.samples_open ? "sidebar left" : "sidebar left closed"}
        style={state.samples_open ? { width: state.samples_width } : undefined}
      >
        <div className="sidebar-head">
          {state.samples_open && <span className="sidebar-label">Samples</span>}
          {state.samples_open && <span className="sidebar-count">{view.samples.length}</span>}
          <button
            type="button"
            className="sidebar-toggle"
            title={state.samples_open ? "Hide samples" : "Show samples"}
            onClick={() => dispatch({ type: "toggle_samples" })}
          >
            {state.samples_open ? "‹" : "›"}
          </button>
        </div>
        {state.samples_open && (
          <div className="sidebar-body">
            <PathInput path={state.path} />
            {view.samples_failed && (
              <p className="banner banner-error">Could not list samples: {view.samples_message}</p>
            )}
            {view.samples_loading && <p className="banner">Loading samples…</p>}
            {!view.samples_loading && !view.samples_failed && (
              <SampleList samples={view.samples} selected_sample={view.active_sample} />
            )}
          </div>
        )}
      </aside>

      {state.samples_open && (
        <ResizeHandle on_resize={(delta) => dispatch({ type: "resize_samples", delta })} />
      )}

      <main className="content">
        <header className="content-head">
          <div className="content-head-text">
            <h1 className="content-title">Extracted ion chromatogram</h1>
            <p className="content-sub">
              {view.active_sample
                ? `${view.active_sample} · m/z ${state.mz_text}`
                : "Pick a sample"}
            </p>
          </div>
          <button
            type="button"
            className="run-button"
            disabled={!view.eic_ready}
            onClick={run_peak_picking}
          >
            ▶ Run peak picking
          </button>
        </header>

        <div className="content-body">
          <MzInput value={state.mz_text} />

          {view.active_sample && (
            <section className="plot-card">
              {!view.mz_valid && <p className="banner">Enter a valid m/z</p>}
              {view.file_failed && (
                <p className="banner banner-error">Could not read the file: {view.file_message}</p>
              )}
              {view.eic_failed && (
                <p className="banner banner-error">
                  Could not build the chromatogram: {view.eic_message}
                </p>
              )}
              {view.eic_loading && <p className="banner">Building the chromatogram…</p>}
              {view.eic_ready && <EicPlot points={view.points} peaks={view.peaks} />}
            </section>
          )}

          {view.peaks_ready && <PeakTable peaks={view.peaks} />}
        </div>
      </main>

      {state.metabolites_open && (
        <ResizeHandle on_resize={(delta) => dispatch({ type: "resize_metabolites", delta })} />
      )}

      <aside
        className={state.metabolites_open ? "sidebar right" : "sidebar right closed"}
        style={state.metabolites_open ? { width: state.metabolites_width } : undefined}
      >
        <div className="sidebar-head">
          <button
            type="button"
            className="sidebar-toggle"
            title={state.metabolites_open ? "Hide metabolites" : "Show metabolites"}
            onClick={() => dispatch({ type: "toggle_metabolites" })}
          >
            {state.metabolites_open ? "›" : "‹"}
          </button>
          {state.metabolites_open && <span className="sidebar-label">Metabolites</span>}
          {state.metabolites_open && <span className="sidebar-count">{compounds.length}</span>}
        </div>
        {state.metabolites_open && (
          <div className="sidebar-body">
            <CompoundList compounds={compounds} selected_label={state.picked_label} />
          </div>
        )}
      </aside>
    </div>
  );
}

export default App;
