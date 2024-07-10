import { run, setup } from "../lib/forsp";

const SCRIPT_NAME = "forsp-worker";

let resolvePendingTask: ((a: string) => void) | null = null;
let rejectPendingTask: ((a: string) => void) | null = null;

const adapter = {
  std: {
    readLine: function (): Promise<string> {
      throw new Error("Function not implemented.");
    },
    printLine: function (str?: string | undefined): void {
      postMessage({
        tag: "stdout",
        data: str ?? "",
      });
    },
    printError: function (str?: string | undefined): void {
      postMessage({
        tag: "stderr",
        data: str ?? "",
      });
    },
  },
  file: {
    read: async function (filePath: string): Promise<string> {
      return new Promise<string>((res, rej) => {
        resolvePendingTask = res;
        rejectPendingTask = rej;
        postMessage({
          tag: "fileRead",
          data: filePath,
        });
      });
    },
  },
};

onmessage = function (e) {
  switch (e.data.tag) {
    case "program":
      const state = setup(adapter, e.data.data);
      run(state).finally(() => {
        postMessage({
          tag: "finish",
        });
      });
      break;
    case "fileReadSuccess":
      resolvePendingTask?.(e.data.data);
      resolvePendingTask = null;
      rejectPendingTask = null;
      break;
    case "fileReadError":
      rejectPendingTask?.(e.data.data);
      resolvePendingTask = null;
      rejectPendingTask = null;
      break;
    default:
      console.error(SCRIPT_NAME, "Unknown message", e.data);
  }
};
