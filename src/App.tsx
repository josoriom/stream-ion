import { useEffect, useState } from 'react';
import type { SampleFile } from 'msutils';
import { default_mz, default_path, time_range } from './data/targets';
import { compounds, type Compound } from './data/compounds';
import { get_samples } from './ms/list_samples';
import { open_ion_file } from './ms/ion_file';
import { get_eic, type Point } from './ms/eic';
import { PathInput } from './components/PathInput';
import { SampleList } from './components/SampleList';
import { MzInput } from './components/MzInput';
import { CompoundList } from './components/CompoundList';
import { EicPlot } from './components/EicPlot';
import './App.css';

interface SamplesState {
  path: string;
  status: 'ok' | 'error';
  names?: string[];
  message?: string;
}

interface FileState {
  url: string;
  status: 'ok' | 'error';
  file?: SampleFile;
  message?: string;
}

interface Outcome {
  key: string;
  status: 'ok' | 'error';
  points?: Point[];
  message?: string;
}

function read_error(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function with_slash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function App() {
  const [path, set_path] = useState(default_path);
  const [samples_state, set_samples_state] = useState<SamplesState | null>(null);
  const [picked_sample, set_picked_sample] = useState<string | null>(null);
  const [mz_text, set_mz_text] = useState(String(default_mz));
  const [picked_label, set_picked_label] = useState<string | null>(null);
  const [file_state, set_file_state] = useState<FileState | null>(null);
  const [outcome, set_outcome] = useState<Outcome | null>(null);
  const [samples_open, set_samples_open] = useState(true);
  const [metabolites_open, set_metabolites_open] = useState(true);

  function change_mz(value: string) {
    set_mz_text(value);
    set_picked_label(null);
  }

  function pick_compound(compound: Compound) {
    set_mz_text(String(compound.mz));
    set_picked_label(compound.label);
  }

  useEffect(() => {
    let active = true;
    get_samples(path)
      .then((names) => {
        if (active) set_samples_state({ path, status: 'ok', names });
      })
      .catch((error: unknown) => {
        if (active) set_samples_state({ path, status: 'error', message: read_error(error) });
      });
    return () => {
      active = false;
    };
  }, [path]);

  const samples_at_path = samples_state?.path === path;
  const samples_ready = Boolean(samples_at_path && samples_state?.status === 'ok');
  const samples_failed = Boolean(samples_at_path && samples_state?.status === 'error');
  const samples_loading = !samples_ready && !samples_failed;
  const samples = samples_ready ? (samples_state?.names ?? []) : [];

  const active_sample =
    picked_sample && samples.includes(picked_sample)
      ? picked_sample
      : (samples[0] ?? null);
  const url = active_sample ? with_slash(path) + active_sample : null;

  useEffect(() => {
    if (!url) return undefined;
    let active = true;
    let opened: SampleFile | null = null;
    open_ion_file(url)
      .then((file) => {
        if (!active) {
          file.dispose?.();
          return;
        }
        opened = file;
        set_file_state({ url, status: 'ok', file });
      })
      .catch((error: unknown) => {
        if (active) set_file_state({ url, status: 'error', message: read_error(error) });
      });
    return () => {
      active = false;
      opened?.dispose?.();
    };
  }, [url]);

  const file_at_url = file_state?.url === url;
  const file_ready = Boolean(file_at_url && file_state?.status === 'ok');
  const file_failed = Boolean(file_at_url && file_state?.status === 'error');
  const file = file_ready ? (file_state?.file ?? null) : null;

  const mz = Number(mz_text);
  const mz_valid = Number.isFinite(mz) && mz > 0;

  useEffect(() => {
    if (!file || !mz_valid) return undefined;
    const key = `${url}|${mz}`;
    let active = true;
    get_eic(file, mz, time_range)
      .then((result) => {
        if (active) set_outcome({ key, status: 'ok', points: result.points });
      })
      .catch((error: unknown) => {
        if (active) set_outcome({ key, status: 'error', message: read_error(error) });
      });
    return () => {
      active = false;
    };
  }, [file, mz, mz_valid, url]);

  const result = outcome && outcome.key === `${url}|${mz}` ? outcome : null;
  const eic_ready = Boolean(file && mz_valid && result?.status === 'ok');
  const eic_failed = Boolean(file && result?.status === 'error');
  const eic_loading = Boolean(file && mz_valid && !eic_ready && !eic_failed);

  return (
    <div className="app">
      <aside className={samples_open ? 'panel left' : 'panel left closed'}>
        <button
          type="button"
          className="toggle"
          aria-label={samples_open ? 'Hide samples' : 'Show samples'}
          title={samples_open ? 'Hide samples' : 'Show samples'}
          onClick={() => set_samples_open((open) => !open)}
        >
          {samples_open ? '‹' : '›'}
        </button>
        {samples_open && (
          <div className="panel-body">
            <PathInput path={path} on_change={set_path} />
            <h2 className="sidebar-title">Samples</h2>
            {samples_failed && (
              <p className="banner banner-error">
                Could not list samples: {samples_state?.message}
              </p>
            )}
            {samples_loading && <p className="banner">Loading samples…</p>}
            {!samples_loading && !samples_failed && (
              <SampleList
                samples={samples}
                selected_sample={active_sample}
                on_select={set_picked_sample}
              />
            )}
          </div>
        )}
      </aside>

      <main className="content">
        <header className="content-header">
          <h1>Extracted ion chromatogram</h1>
          <p className="target-info">
            {active_sample ? `${active_sample} · m/z ${mz_text}` : 'Pick a sample'}
          </p>
        </header>

        <MzInput value={mz_text} on_change={change_mz} />

        {active_sample && (
          <section className="plot-card">
            {!mz_valid && <p className="banner">Enter a valid m/z</p>}
            {file_failed && (
              <p className="banner banner-error">
                Could not read the file: {file_state?.message}
              </p>
            )}
            {eic_failed && (
              <p className="banner banner-error">
                Could not build the chromatogram: {result?.message}
              </p>
            )}
            {eic_loading && <p className="banner">Building the chromatogram…</p>}
            {eic_ready && <EicPlot points={result?.points ?? []} />}
          </section>
        )}
      </main>

      <aside className={metabolites_open ? 'panel right' : 'panel right closed'}>
        <button
          type="button"
          className="toggle"
          aria-label={metabolites_open ? 'Hide metabolites' : 'Show metabolites'}
          title={metabolites_open ? 'Hide metabolites' : 'Show metabolites'}
          onClick={() => set_metabolites_open((open) => !open)}
        >
          {metabolites_open ? '›' : '‹'}
        </button>
        {metabolites_open && (
          <div className="panel-body">
            <h2 className="sidebar-title">Metabolites</h2>
            <CompoundList
              compounds={compounds}
              selected_label={picked_label}
              on_select={pick_compound}
            />
          </div>
        )}
      </aside>
    </div>
  );
}

export default App;
