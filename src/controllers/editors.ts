import { create } from "zustand";
import { persist } from "zustand/middleware";
import { APP } from "../utils/local-store-keys";
import { useCallback } from "react";

type EditorPage = {
  fileId: string;
  row: number;
  column: number;
  active: boolean;
  seq: number;
};

const useEditorController = create<Record<string, EditorPage>>()(
  persist(
    () =>
      ({
        tutorial: {
          fileId: "tutorial",
          row: 0,
          column: 0,
          active: true,
          seq: 1,
        },
      } as Record<string, EditorPage>),
    { name: `${APP}-editors` }
  )
);

export function useEditorGroups() {
  return [];
}

export function useEditorsForGroup() {
  return [];
}

export function useActiveEditorForGroup() {
  return useEditorController((s) => Object.values(s)[0]);
}

export function useEditorDispatch() {
  return useCallback((f: EditorPage) => {
    useEditorController.setState(
      {
        [f.fileId]: f,
      },
      true
    );
  }, []);
}
