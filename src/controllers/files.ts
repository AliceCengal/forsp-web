import { useCallback } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { APP } from "../utils/local-store-keys";
import { persist } from "zustand/middleware";
import presets from "../../data/presets.json";

type ContentFile = {
  name: string;
  cts: string;
  uts: string;
  content: string;
};

const useFileController = create<Record<string, ContentFile>>()(
  persist(() => presets as Record<string, ContentFile>, {
    name: `${APP}-files`,
  })
);

export function useFileCount() {
  return useFileController(
    (s) =>
      Object.entries(s).filter(
        ([k, v]) => k !== "std" && k !== "tutorial" && typeof v != "undefined"
      ).length
  );
}

export function useFileList() {
  return useFileController(useShallow((s) => Object.keys(s)));
}

export function useSystemFileList() {
  return ["std", "tutorial"];
}

export function useUserFileList() {
  return useFileController(
    useShallow((s) =>
      Object.entries(s)
        .filter(
          ([k, v]) => k !== "std" && k !== "tutorial" && typeof v != "undefined"
        )
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

export function readFileSync(filename: string) {
  return Object.entries(useFileController.getState()).find(
    ([k, v]) => v.name.slice(0, -3) === filename
  )?.[1]?.content;
}
