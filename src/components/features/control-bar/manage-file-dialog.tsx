import { cloneElement } from "react";

import { useFile, useFileDispatch } from "../../../controllers/files";
import { PropsWithChildElem } from "../../../utils/components";
import { Box, Grid } from "../../common/box";
import { button } from "../../common/button";
import { CloseIcon, DoneIcon } from "../../icons";

import useToggle from "../../../utils/use-toggle";
import { Dialog, DialogActions } from "../../common/modal-dialog";
import { panel } from "../../common/panel";
import { ToggleView } from "../../common/toggle-view";
import { TextField } from "../../common/form-control";
import { useBlobUrl } from "../../../utils/use-blob-url";
import { parse_s36_date } from "../../../utils/render-date";

type Props = { fileId: string };

export function ManageRemoteFileDialog({
  fileId,
  children,
}: PropsWithChildElem<Props>) {
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
              Updated on {parse_s36_date(file.uts).toLocaleDateString()}
            </Box>
          </p>

          <p>
            <button
              type="button"
              className={button({ kind: "text" })}
              onClick={() => {
                if (!file.remoteURL)
                  return alert("Set a remote URL to enable fetch");
                fetch(file.remoteURL)
                  .then(async (res) => {
                    const content = await res.text();
                    const ts = Date.now().toString(36);
                    dispatch({
                      name: file.name,
                      cts: file.cts,
                      uts: ts,
                      content: content,
                      remoteURL: file.remoteURL,
                    });
                  })
                  .then(() => alert("Done resynced"))
                  .catch((err) => alert("Failed to resync: " + err.message));
              }}
            >
              resync with remote
            </button>
          </p>

          <ToggleView>
            {(open, toggleOpen) =>
              open ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const f = e.target as any;
                    let remoteURL = f["remoteUrl"].value as string;
                    // console.log(filename);

                    dispatch({
                      name: file.name,
                      cts: file.cts,
                      uts: Date.now().toString(36),
                      content: file.content,
                      remoteURL,
                    });
                    toggleOpen();
                  }}
                >
                  <Grid
                    marginBlockEnd="var(--sp-2)"
                    gap="1px"
                    gridTemplateColumns="minmax(0px, 1fr) auto auto"
                  >
                    <TextField
                      autoFocus
                      name="remoteUrl"
                      defaultValue={file.remoteURL ?? ""}
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
                  </Grid>
                </form>
              ) : (
                <p>
                  <button
                    type="button"
                    className={button({ kind: "text" })}
                    onClick={toggleOpen}
                  >
                    edit remote url
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

export function ManageLocalFileDialog({
  fileId,
  children,
}: PropsWithChildElem<Props>) {
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
                  <Grid
                    marginBlockEnd="var(--sp-2)"
                    gap="1px"
                    gridTemplateColumns="minmax(0px, 1fr) auto auto"
                  >
                    <TextField
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
                  </Grid>
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
