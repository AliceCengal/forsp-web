import {
  useActiveEditorForGroup,
  useEditorDispatch,
} from "../../../controllers/editors";
import {
  useFile,
  useFileCount,
  useFileDispatch,
} from "../../../controllers/files";

import { useDebouncedState } from "../../../utils/use-debounced-state";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Suspense, lazy } from "react";
import { Box, Grid } from "../../common/box";
import styles from "./editor-area.module.css";
import { spinner } from "../../common/spinner";
import { EditorRunner } from "./editor-runner";

const CodeMirror = lazy(() => import("@uiw/react-codemirror"));

export function EditorPanel({ group }: { group: any }) {
  const active = useActiveEditorForGroup();
  const file = useFile(active?.fileId);
  const dispatch = useFileDispatch();
  group;

  const [value, setValue] = useDebouncedState(file?.content ?? "", {
    delay: 2000,
    onChange: (value) => {
      if (file?.content && file?.content != value) {
        dispatch({
          ...file,
          content: value,
          uts: Date.now().toString(36),
        });
      }
    },
  });

  if (!file) {
    return <EmptyPanel />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <CodeMirror
        style={{ overflowY: "auto" }}
        theme={vscodeDark}
        value={value}
        onChange={setValue}
      />
      <EditorRunner
        file={{
          ...file,
          content: value,
        }}
      />
    </Suspense>
  );
}

const NEW_FILE_CONTENT = `\
(
  stack print;
)\
`;

function Loading() {
  return (
    <Grid justifyItems="center" alignContent="center" maxHeight="75vh">
      <div
        className={spinner({
          size: "xlarge",
          kind: "con",
        })}
      ></div>
    </Grid>
  );
}

function EmptyPanel() {
  const fileCount = useFileCount();
  const dispatch = useFileDispatch();
  const editorDispatch = useEditorDispatch();

  function handleOpenTutorial() {
    editorDispatch({
      fileId: "tutorial.fp",
      row: 0,
      column: 0,
      active: true,
      seq: 1,
    });
  }

  function handleCreateNew() {
    const id = Date.now().toString(36);
    dispatch({
      name: `new-file-${fileCount + 1}.fp`,
      cts: id,
      uts: id,
      content: NEW_FILE_CONTENT,
    });
    editorDispatch({
      fileId: id,
      row: 0,
      column: 0,
      active: true,
      seq: 0,
    });
  }

  return (
    <Grid justifyItems="center" alignContent="center" maxHeight="75vh">
      <Box fontSize="xxx-large" marginBlockEnd="1rem">
        Welcome to Forsp Web!
      </Box>
      <p>
        &gt; Follow the tutorial to learn the basics&emsp;
        <button className={styles["panel-link"]} onClick={handleOpenTutorial}>
          [ open tutorial ]
        </button>
      </p>
      <p>
        &gt; Or start hacking&emsp;
        <button className={styles["panel-link"]} onClick={handleCreateNew}>
          [ create new file ]
        </button>
      </p>
    </Grid>
  );
}
