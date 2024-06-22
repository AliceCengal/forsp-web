import {
  useFileCount,
  useFileDispatch,
  useFileList,
} from "../../../controllers/files";
import { Box, Grid } from "../../common/box";
import styles from "./control-bar.module.css";
import { FileItem } from "./file-item";

export function ControlBar() {
  const fileCount = useFileCount();
  const dispatch = useFileDispatch();
  const fileList = useFileList();

  return (
    <div className={styles["container"]}>
      <Grid>
        <Box as="h1" textAlign="center">
          Forsp Web Editor
        </Box>

        <button
          onClick={() => {
            dispatch({
              name: `New File ${fileCount + 1}`,
              cts: Date.now().toString(36),
              uts: Date.now().toString(36),
              content: "",
            });
          }}
        >
          new file
        </button>
        {fileList.map((fid) => (
          <FileItem key={fid} fileId={fid} />
        ))}
      </Grid>
    </div>
  );
}
