import { useCallback, useEffect } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { APP } from "../utils/local-store-keys";
import { persist } from "zustand/middleware";

type ContentFile = {
  name: string;
  cts: string;
  uts: string;
  content: string;
  remoteURL?: string;
};

const useFileController = create<Record<string, ContentFile>>()(
  persist(() => ({} as Record<string, ContentFile>), {
    name: `${APP}-files`,
  })
);

export function useFileCount() {
  return useUserFileList().length;
}

export function useFileList() {
  return useFileController(useShallow((s) => Object.keys(s)));
}

export function useSystemFileList() {
  return useFileController(
    useShallow((s) =>
      Object.entries(s)
        .filter(([_, v]) => typeof v != "undefined" && v.remoteURL)
        .map(([k]) => k)
    )
  );
}

export function useUserFileList() {
  return useFileController(
    useShallow((s) =>
      Object.entries(s)
        .filter(([_, v]) => typeof v != "undefined" && !v.remoteURL)
        .map(([k]) => k)
    )
  );
}

export function useFile(id: string) {
  return useFileController((s) => s[id]);
}

export function useFileDispatch() {
  return useCallback((f: ContentFile) => {
    if (!f.uts) {
      useFileController.setState({ [f.cts]: undefined });
    } else {
      useFileController.setState({
        [f.cts]: { ...f, uts: f.uts ?? Date.now().toString(36) },
      });
    }
  }, []);
}

const SEED_KEY = `${APP}-fileseeding`;

const SYSTEM_FILES = {
  "std.fp":
    "https://raw.githubusercontent.com/AliceCengal/forsp-js/main/data/presets/std.fp",
  "tutorial.fp":
    "https://raw.githubusercontent.com/AliceCengal/forsp-js/main/data/presets/tutorial.fp",
  "extensions.fp":
    "https://raw.githubusercontent.com/AliceCengal/forsp-js/main/data/presets/extensions.fp",
};

export function useFilesSeeding() {
  useEffect(() => {
    if (localStorage.getItem(SEED_KEY)) return;

    Promise.all(
      Object.entries(SYSTEM_FILES).map(async ([key, url]) => {
        const f = await fetch(url).then((res) => res.text());
        const ts = Date.now().toString(36);
        useFileController.setState({
          [key]: {
            name: key,
            cts: key,
            uts: ts,
            content: f,
            remoteURL: url,
          },
        });
      })
    ).then(() => {
      localStorage.setItem(SEED_KEY, "1");
    });
  }, []);
}

export function readFileSync(filename: string) {
  return Object.values(useFileController.getState()).find(
    (v) => v.name === filename
  )?.content;
}
