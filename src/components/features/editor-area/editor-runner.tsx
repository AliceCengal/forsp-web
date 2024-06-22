import { useState } from "react";
import { useActiveEditorForGroup } from "../../../controllers/editors";
import { useFile } from "../../../controllers/files";
import { Box, Flex } from "../../common/box";
import { button } from "../../common/button";
import { CloseIcon, PlayIcon } from "../../icons";
import { panel } from "../../common/panel";

export function EditorRunner() {
  const active = useActiveEditorForGroup();
  const file = useFile(active.fileId);

  const [isRunning, setRunning] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  return (
    <Box
      position="absolute"
      top="48px"
      right="24px"
      zIndex="10"
      width={isRunning ? "80%" : "auto"}
    >
      <Flex justifyContent="flex-end">
        {isRunning && (
          <button
            className={button({ kind: "soft", size: "large" })}
            onClick={() => setRunning(false)}
          >
            <CloseIcon />
          </button>
        )}
        <button
          className={button({ kind: "bold", size: "large" })}
          onClick={() => {
            setRunning(true);
            setResult([`Running "${file.name}"...`]);
          }}
        >
          <PlayIcon />
        </button>
      </Flex>
      {isRunning && (
        <Box
          className={panel()}
          maxHeight="10rem"
          overflowY="auto"
          whiteSpace="pre"
        >
          {result.map((row) => (
            <div>{row}</div>
          ))}
        </Box>
      )}
    </Box>
  );
}
