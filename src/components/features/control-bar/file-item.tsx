import { cloneElement } from "react";
import {
  useActiveEditorForGroup,
  useEditorDispatch,
} from "../../../controllers/editors";
import {
  useFile,
  useFileCount,
  useFileDispatch,
} from "../../../controllers/files";
import { PropsWithChildElem } from "../../../utils/components";
import { Box, Flex } from "../../common/box";
import { button } from "../../common/button";
import { AddIcon, CloseIcon, DoneIcon, MoreIcon } from "../../icons";
import styles from "./control-bar.module.css";
import useToggle from "../../../utils/use-toggle";
import { Dialog, DialogActions } from "../../common/modal-dialog";
import { panel } from "../../common/panel";
import { ToggleView } from "../../common/toggle-view";
import { TextField } from "../../common/form-control";
import { useBlobUrl } from "../../../utils/use-blob-url";
import { parse_s36_date } from "../../../utils/render-date";

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
            active.fileId === fileId
              ? "file-item-button-active"
              : "file-item-button"
          ]
        }
        onClick={() => {
          if (active.fileId !== fileId) {
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
            active.fileId === fileId
              ? "file-item-button-active"
              : "file-item-button"
          ]
        }
        onClick={() => {
          if (active.fileId !== fileId) {
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
      <ManageFileDialog fileId={fileId}>
        <button
          className={button({
            className: styles["file-item-more"],
            kind: "text",
            size: "small",
          })}
        >
          <MoreIcon />
        </button>
      </ManageFileDialog>
    </Flex>
  );
}

function ManageFileDialog({ fileId, children }: PropsWithChildElem<Props>) {
  const file = useFile(fileId);
  const dispatch = useFileDispatch();
  const [open, toggleOpen] = useToggle();

  const downloadURL = useBlobUrl(file.content, "text/plain");

  return (
    <>
      {cloneElement(children, { onClick: toggleOpen })}
      <Dialog
        open={open}
        onClose={() => {
          open && toggleOpen();
        }}
      >
        <div className={panel({ maxWidth: "sm" })}>
          <h2>{file.name}</h2>
          <p>
            <Box as="span" fontSize="small" fontStyle="italic">
              Created on {parse_s36_date(file.cts).toLocaleDateString()}, last
              updated on {parse_s36_date(file.uts).toLocaleDateString()}
            </Box>
          </p>

          <ToggleView>
            {(open, toggleOpen) =>
              open ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const f = e.target as any;
                    let filename = f["filename"].value as string;
                    // console.log(filename);
                    if (!filename.endsWith(".fp")) {
                      filename = filename + ".fp";
                    }
                    dispatch({
                      name: filename,
                      cts: file.cts,
                      uts: Date.now().toString(36),
                      content: file.content,
                    });
                    toggleOpen();
                  }}
                >
                  <Flex marginBlockEnd="var(--sp-2)" gap="1px">
                    <TextField
                      {...({ size: "40" } as any)}
                      autoFocus
                      name="filename"
                      defaultValue={file.name}
                    />
                    <button
                      type="button"
                      className={button({ kind: "soft" })}
                      onClick={toggleOpen}
                    >
                      <CloseIcon />
                    </button>
                    <button className={button({ kind: "soft" })}>
                      <DoneIcon />
                    </button>
                  </Flex>
                </form>
              ) : (
                <p>
                  <button
                    type="button"
                    className={button({ kind: "text" })}
                    onClick={toggleOpen}
                  >
                    edit file name
                  </button>
                </p>
              )
            }
          </ToggleView>

          <p>
            <a
              className={button({ kind: "text" })}
              download={file.name}
              href={downloadURL}
            >
              download file
            </a>
          </p>

          <p>
            <ToggleView>
              {(open, toggleOpen) =>
                open ? (
                  <>
                    <span>Confirm permanently delete this file?</span>&emsp;
                    <button
                      className={button({ kind: "soft" })}
                      onClick={() => {
                        dispatch({ cts: file.cts } as any);
                        toggleOpen();
                      }}
                    >
                      delete
                    </button>
                  </>
                ) : (
                  <button
                    className={button({ kind: "text" })}
                    onClick={toggleOpen}
                  >
                    delete file
                  </button>
                )
              }
            </ToggleView>
          </p>
          <DialogActions>
            <button className={button({ kind: "text" })} onClick={toggleOpen}>
              close
            </button>
          </DialogActions>
        </div>
      </Dialog>
    </>
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
