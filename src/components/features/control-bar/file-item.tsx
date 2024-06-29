import {
  useActiveEditorForGroup,
  useEditorDispatch,
} from "../../../controllers/editors";
import {
  useFile,
  useFileCount,
  useFileDispatch,
} from "../../../controllers/files";

import { Box, Flex } from "../../common/box";
import { button } from "../../common/button";
import { AddIcon, MoreIcon } from "../../icons";
import styles from "./control-bar.module.css";
import {
  ManageLocalFileDialog,
  ManageRemoteFileDialog,
} from "./manage-file-dialog";

type Props = { fileId: string };

export function SystemFileItem({ fileId }: Props) {
  const file = useFile(fileId);
  const dispatch = useEditorDispatch();
  const active = useActiveEditorForGroup();

  return (
    <Flex className={styles["file-item-row"]}>
      <button
        className={
          styles[
            active?.fileId === fileId
              ? "file-item-button-active"
              : "file-item-button"
          ]
        }
        onClick={() => {
          if (active?.fileId !== fileId) {
            dispatch({
              fileId,
              row: 0,
              column: 0,
              active: true,
              seq: 1,
            });
          }
        }}
      >
        {file.name}
      </button>
      <Box flexGrow={1} />
      <ManageRemoteFileDialog fileId={fileId}>
        <button
          className={button({
            className: styles["file-item-more"],
            kind: "text",
            size: "small",
          })}
        >
          <MoreIcon />
        </button>
      </ManageRemoteFileDialog>
    </Flex>
  );
}

export function UserFileItem({ fileId }: Props) {
  const file = useFile(fileId);
  const dispatch = useEditorDispatch();
  const active = useActiveEditorForGroup();

  if (!file) return null;

  return (
    <Flex className={styles["file-item-row"]}>
      <button
        className={
          styles[
            active?.fileId === fileId
              ? "file-item-button-active"
              : "file-item-button"
          ]
        }
        onClick={() => {
          if (active?.fileId !== fileId) {
            dispatch({
              fileId,
              row: 0,
              column: 0,
              active: true,
              seq: 1,
            });
          }
        }}
      >
        {file.name}
      </button>
      <Box flexGrow={1} />
      <ManageLocalFileDialog fileId={fileId}>
        <button
          className={button({
            className: styles["file-item-more"],
            kind: "text",
            size: "small",
          })}
        >
          <MoreIcon />
        </button>
      </ManageLocalFileDialog>
    </Flex>
  );
}

const NEW_FILE_CONTENT = `\
(
  stack print;
)\
`;

export function NewFileButton() {
  const fileCount = useFileCount();
  const dispatch = useFileDispatch();
  const editorDispatch = useEditorDispatch();

  return (
    <button
      className={button({ kind: "line", size: "small" })}
      onClick={() => {
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
      }}
    >
      <AddIcon />
      <span>new file</span>
    </button>
  );
}
