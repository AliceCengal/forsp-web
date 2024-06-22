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
  return useFileController((s) => Object.keys(s).length);
}

export function useFileList() {
  return useFileController(useShallow((s) => Object.keys(s)));
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
