import { useEffect, useReducer, type ReactNode } from "react";
import type { SampleFile } from "msutils";
import { get_samples } from "../ms/list_samples";
import { open_ion_file } from "../ms/ion_file";
import { get_eic } from "../ms/eic";
import { time_range } from "../data/targets";
import { DispatchContext, StateContext } from "./context";
import { initial_state, read_error, reducer, select_view } from "./reducer";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initial_state);

  const { path } = state;
  const { url, file, mz, mz_valid } = select_view(state);

  useEffect(() => {
    let active = true;
    get_samples(path)
      .then((names) => {
        if (active) dispatch({ type: "samples_loaded", path, names });
      })
      .catch((error: unknown) => {
        if (active) dispatch({ type: "samples_failed", path, message: read_error(error) });
      });
    return () => {
      active = false;
    };
  }, [path]);

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
        dispatch({ type: "file_opened", url, file });
      })
      .catch((error: unknown) => {
        if (active) dispatch({ type: "file_failed", url, message: read_error(error) });
      });
    return () => {
      active = false;
      opened?.dispose?.();
    };
  }, [url]);

  useEffect(() => {
    if (!file || !mz_valid) return undefined;
    const key = `${url}|${mz}`;
    let active = true;
    get_eic(file, mz, time_range)
      .then((result) => {
        if (active) dispatch({ type: "eic_ready", key, points: result.points });
      })
      .catch((error: unknown) => {
        if (active) dispatch({ type: "eic_failed", key, message: read_error(error) });
      });
    return () => {
      active = false;
    };
  }, [file, mz, mz_valid, url]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}
