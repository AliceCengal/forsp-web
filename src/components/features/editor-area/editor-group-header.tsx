import { useActiveEditorForGroup } from "../../../controllers/editors";
import { useFile } from "../../../controllers/files";
import { Box, Flex } from "../../common/box";
import { button } from "../../common/button";
import { CloseIcon } from "../../icons";

export function EditorGroupHeader() {
  return (
    <Flex
      paddingInline="var(--sp-2)"
      height="var(--sp-4)"
      alignItems="flex-end"
    >
      <EditorHeader />
    </Flex>
  );
}

function EditorHeader() {
  const editor = useActiveEditorForGroup();
  const file = useFile(editor?.fileId);

  return (
    <Flex alignItems="center">
      <span>{file?.name ?? ""}</span>&nbsp;
      <button
        className={button({ kind: "text", size: "small" })}
        style={{ display: "none" }}
      >
        <CloseIcon />
      </button>
    </Flex>
  );
}
