import {
  useFilesSeeding,
  useSystemFileList,
  useUserFileList,
} from "../../../controllers/files";
import { useMediaQuery } from "../../../utils/use-media-query";
import { Box, Flex, Grid } from "../../common/box";
import { DropDownIcon } from "../../icons";
import styles from "./control-bar.module.css";
import { NewFileButton, SystemFileItem, UserFileItem } from "./file-item";

export function ControlBar() {
  const isBigScreen = useMediaQuery("(min-width:640px)");
  useFilesSeeding();

  return (
    <div className={styles["container"]}>
      {isBigScreen ? <ControlBarLarge /> : <ControlBarSmall />}
    </div>
  );
}

function ControlBarLarge() {
  const systemFiles = useSystemFileList();
  const userFiles = useUserFileList();

  return (
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
        remotes
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
        locals
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
  );
}

function ControlBarSmall() {
  const systemFiles = useSystemFileList();
  const userFiles = useUserFileList();

  return (
    <details>
      <Flex as="summary">
        <Box as="h1" margin="0">
          Forsp Web Editor
        </Box>

        <Box flexGrow="1">
          <a href="https://github.com/AliceCengal/forsp-web">[ Github ]</a>
          &ensp;
          <a href="https://github.com/xorvoid/forsp">[ origin ]</a>
        </Box>
        <DropDownIcon />
      </Flex>
      <Flex height="100%" flexDirection="column">
        <hr />
        <Box
          as="div"
          textAlign="center"
          fontSize="small"
          marginBlockStart="-18px"
        >
          remotes
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
          locals
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
    </details>
  );
}
