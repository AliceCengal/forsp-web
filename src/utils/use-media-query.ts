import { useCallback, useSyncExternalStore } from "react";

type MediaQuery = `(${string}:${string})`;

function getSnapshot(query: MediaQuery) {
  return window.matchMedia(query).matches;
}

function subscribe(handler: () => void, query: MediaQuery) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", handler);

  return () => {
    mql.removeEventListener("change", handler);
  };
}

export function useMediaQuery(query: MediaQuery, initialState = false) {
  return useSyncExternalStore(
    useCallback((handler) => subscribe(handler, query), [query]),
    () => getSnapshot(query),
    () => initialState
  );
}
