import { useState } from "react";
import { useActiveEditorForGroup } from "../../../controllers/editors";
import { readFileSync, useFile } from "../../../controllers/files";
import { Box, Flex } from "../../common/box";
import { button } from "../../common/button";
import { CloseIcon, PlayIcon } from "../../icons";
import { panel } from "../../common/panel";
import { IO, run, setup } from "../../../lib/forsp";

export function EditorRunner() {
  const active = useActiveEditorForGroup();
  const file = useFile(active.fileId);

  const [isRunning, setRunning] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  function handleRun() {
    setRunning(true);
    setResult([`Running "${file.name}"...`]);

    const adapter: IO = {
      std: {
        readLine: function (): string {
          throw new Error("Function not implemented.");
        },
        printLine: function (str?: string | undefined): void {
          setResult((res) => res.concat(str ?? ""));
        },
        printError: function (str?: string | undefined): void {
          setResult((res) => res.concat(str ?? ""));
        },
      },
      file: {
        read: function (filePath: string): string {
          if (!filePath.startsWith("./")) {
            throw new Error(`File not found: "${filePath}"`);
          }
          const fileContent = readFileSync(filePath.slice(2));
          if (!fileContent) {
            throw new Error(`File not found: "${filePath}"`);
          }
          return fileContent;
        },
      },
    };
    const state = setup(adapter, file.content);
    run(state);
  }

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
          onClick={handleRun}
        >
          <PlayIcon />
        </button>
      </Flex>
      {isRunning && (
        <Box
          className={panel()}
          maxHeight="36rem"
          overflowY="auto"
          whiteSpace="pre-wrap"
          resize="vertical"
        >
          {result.map((row) => (
            <div>{row}</div>
          ))}
        </Box>
      )}
    </Box>
  );
}
