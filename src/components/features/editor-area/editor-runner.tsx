import { useRef, useState } from "react";
import { readFileSync, useFile } from "../../../controllers/files";
import { Box, Flex } from "../../common/box";
import { button } from "../../common/button";
import { CloseIcon, OpenDrawerIcon, PlayIcon } from "../../icons";
import { panel } from "../../common/panel";
import { useMediaQuery } from "../../../utils/use-media-query";
import useToggle from "../../../utils/use-toggle";
import { spinner } from "../../common/spinner";

export function EditorRunner({ file }: { file: ReturnType<typeof useFile> }) {
  const isBigScreen = useMediaQuery("(min-width:640px)");

  const [open, toggleOpen] = useToggle();
  const [isRunning, setRunning] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const workerRef = useRef<Worker | null>(null);

  function handleRun() {
    setRunning(true);
    setResult([`Running "${file.name}"...`]);

    if (workerRef.current) {
      workerRef.current.terminate();
    }
    const worker = (workerRef.current = new Worker(
      new URL("../../../controllers/forsp-worker.ts", import.meta.url),
      { type: "module" }
    ));

    worker.onmessage = (e: MessageEvent) => {
      switch (e.data.tag) {
        case "stdout":
        case "stderr":
          setResult((res) => res.concat(e.data.data));
          break;
        case "fileRead":
          const filePath = e.data.data;
          if (!filePath.startsWith("./")) {
            worker.postMessage({
              tag: "fileReadError",
              data: `File not found: "${filePath}"`,
            });
          }
          const fileContent = readFileSync(filePath.slice(2));
          if (!fileContent) {
            worker.postMessage({
              tag: "fileReadError",
              data: `File not found: "${filePath}"`,
            });
          }
          worker.postMessage({
            tag: "fileReadSuccess",
            data: fileContent,
          });
          break;
        case "finish":
          setRunning(false);
          break;
        default:
      }
    };

    worker.postMessage({
      tag: "program",
      data: file.content,
    });
  }

  const btnSize = isBigScreen ? "large" : "regular";

  return (
    <Box
      position="absolute"
      top="48px"
      right="24px"
      zIndex="10"
      width={open ? "80%" : "auto"}
    >
      {Boolean(file?.content) && (
        <Flex justifyContent="flex-end">
          {(open || result?.length > 1) && (
            <button
              className={button({ kind: "soft", size: btnSize })}
              onClick={() => {
                if (workerRef.current) {
                  workerRef.current.terminate();
                  workerRef.current = null;
                }
                toggleOpen();
                setRunning(false);
              }}
            >
              {open ? <CloseIcon /> : <OpenDrawerIcon />}
            </button>
          )}
          <button
            className={button({ kind: "bold", size: btnSize })}
            onClick={() => {
              if (!open) {
                toggleOpen();
              }
              if (!isRunning) {
                handleRun();
              } else {
                if (workerRef.current) {
                  workerRef.current.terminate();
                  workerRef.current = null;
                }
                setRunning(false);
                setResult((res) => res.concat("...terminated"));
              }
            }}
          >
            {isRunning ? (
              <div className={spinner({ size: "small" })} />
            ) : (
              <PlayIcon />
            )}
          </button>
        </Flex>
      )}
      {open && (
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
