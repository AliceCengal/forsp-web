import { useActiveEditorForGroup, useEditorDispatch } from "../../../controllers/editors";
import { useFile } from "../../../controllers/files";
import { Flex } from "../../common/box";
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
  const editorDispatch = useEditorDispatch();

  return (
    <Flex alignItems="center">
      {file?.name && <>
        <span>{file?.name ?? ""}</span>&nbsp;
        <button
          className={button({ kind: "text", size: "small" })}
          onClick={() => { editorDispatch({ ...editor, active: false }) }}
        >
          <CloseIcon />
        </button>
      </>}
    </Flex>
  );
}
