import { createContext, useContext, type Dispatch } from "react";
import type { Action, State } from "./reducer";

export const StateContext = createContext<State | null>(null);
export const DispatchContext = createContext<Dispatch<Action> | null>(null);

export function useAppState(): State {
  const state = useContext(StateContext);
  if (state === null) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return state;
}

export function useAppDispatch(): Dispatch<Action> {
  const dispatch = useContext(DispatchContext);
  if (dispatch === null) {
    throw new Error("useAppDispatch must be used within an AppProvider");
  }
  return dispatch;
}
