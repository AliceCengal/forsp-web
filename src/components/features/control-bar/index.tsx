import { useSystemFileList, useUserFileList } from "../../../controllers/files";
import { Box, Flex, Grid } from "../../common/box";
import styles from "./control-bar.module.css";
import { NewFileButton, SystemFileItem, UserFileItem } from "./file-item";

export function ControlBar() {
  const systemFiles = useSystemFileList();
  const userFiles = useUserFileList();

  return (
    <div className={styles["container"]}>
      <Flex height="100%" flexDirection="column">
        <Box as="h1">Forsp Web Editor</Box>

        <div>
          <a href="https://github.com/AliceCengal/forsp-web">[ Github ]</a>
          &ensp;
          <a href="https://github.com/xorvoid/forsp">[ origin ]</a>
        </div>
        <hr />
        <Box
          as="div"
          textAlign="center"
          fontSize="small"
          marginBlockStart="-18px"
        >
          built-ins
        </Box>

        <Grid gap="var(--sp-0_5)">
          {systemFiles.map((fid) => (
            <SystemFileItem key={fid} fileId={fid} />
          ))}
        </Grid>

        <hr />
        <Box
          as="div"
          textAlign="center"
          fontSize="small"
          marginBlockStart="-18px"
        >
          user files
        </Box>

        <Grid
          gap="var(--sp-0_5)"
          paddingBlock="var(--sp-1)"
          overflowY="auto"
          overflowX="hidden"
        >
          {userFiles.map((fid) => (
            <UserFileItem key={fid} fileId={fid} />
          ))}
        </Grid>

        <Grid>
          <NewFileButton />
        </Grid>
      </Flex>
    </div>
  );
}
