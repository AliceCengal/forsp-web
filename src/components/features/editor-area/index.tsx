import { useActiveEditorForGroup } from "../../../controllers/editors";
import { Box } from "../../common/box";
import styles from "./editor-area.module.css";
import { EditorGroupHeader } from "./editor-group-header";
import { EditorPanel } from "./editor-panel";
import { EditorRunner } from "./editor-runner";

export function EditorArea() {
  return (
    <div className={styles["editor-container"]}>
      <EditorGroup />
    </div>
  );
}

function EditorGroup() {
  const active = useActiveEditorForGroup();
  console.log("EditorGroup", { active });
  return (
    <Box
      height="100%"
      display="grid"
      gridTemplateRows="auto 1fr"
      position="relative"
    >
      <EditorGroupHeader />
      <EditorRunner />
      <EditorPanel key={active.fileId} group="" />
    </Box>
  );
}
