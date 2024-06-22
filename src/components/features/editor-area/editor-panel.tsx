import { useActiveEditorForGroup } from "../../../controllers/editors";
import { useFile, useFileDispatch } from "../../../controllers/files";

import { useDebouncedState } from "../../../utils/use-debounced-state";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Suspense, lazy } from "react";

const CodeMirror = lazy(() => import("@uiw/react-codemirror"));

export function EditorPanel({ group }: { group: any }) {
  const active = useActiveEditorForGroup();
  const file = useFile(active.fileId);
  const dispatch = useFileDispatch();
  group;

  const [value, setValue] = useDebouncedState(file?.content ?? "", {
    delay: 2000,
    onChange: (value) => {
      if (file.content != value) {
        dispatch({
          ...file,
          content: value,
          uts: Date.now().toString(36),
        });
      }
    },
  });

  if (!file) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CodeMirror
        style={{ overflowY: "auto" }}
        theme={vscodeDark}
        value={value}
        onChange={setValue}
      />
    </Suspense>
  );
}
