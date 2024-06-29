import { useMemo, useState } from "react";
import { useActiveEditorForGroup } from "../../../controllers/editors";
import { readFileSync, useFile } from "../../../controllers/files";
import { Box, Flex } from "../../common/box";
import { button } from "../../common/button";
import { CloseIcon, PlayIcon } from "../../icons";
import { panel } from "../../common/panel";
import { IO, run, setup } from "../../../lib/forsp";
import { useMediaQuery } from "../../../utils/use-media-query";

export function EditorRunner({ file }: { file: ReturnType<typeof useFile> }) {
  const isBigScreen = useMediaQuery("(min-width:640px)");

  const [isRunning, setRunning] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const adapter = useMemo<IO>(
    () => ({
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
    }),
    []
  );

  function handleRun() {
    setRunning(true);
    setResult([`Running "${file.name}"...`]);

    const state = setup(adapter, file.content);
    run(state);
  }

  const btnSize = isBigScreen ? "large" : "regular";

  return (
    <Box
      position="absolute"
      top="48px"
      right="24px"
      zIndex="10"
      width={isRunning ? "80%" : "auto"}
    >
      {Boolean(file?.content) && (
        <Flex justifyContent="flex-end">
          {isRunning && (
            <button
              className={button({ kind: "soft", size: btnSize })}
              onClick={() => setRunning(false)}
            >
              <CloseIcon />
            </button>
          )}
          <button
            className={button({ kind: "bold", size: btnSize })}
            onClick={handleRun}
          >
            <PlayIcon />
          </button>
        </Flex>
      )}
      {isRunning && (
        <Box
          className={panel()}
          maxHeight="36rem"
          overflowY="auto"
          whiteSpace="pre-wrap"
          resize="vertical"
        >
          {result.map((row, ix) => (
            <div key={ix}>{row}</div>
          ))}
        </Box>
      )}
    </Box>
  );
}
