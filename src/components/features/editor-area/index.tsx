import { useActiveEditorForGroup } from "../../../controllers/editors";
import { Grid } from "../../common/box";
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
  // console.log("EditorGroup", { active });
  return (
    <Grid
      height="100%"
      position="relative"
      gridTemplateRows="auto minmax(0, 1fr)"
      gridTemplateColumns="minmax(0,1fr)"
    >
      <EditorGroupHeader />
      <EditorRunner />
      <EditorPanel key={active.fileId} group="" />
    </Grid>
  );
}
