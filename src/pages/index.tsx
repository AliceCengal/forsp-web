import { ControlBar } from "../components/features/control-bar";
import { EditorArea } from "../components/features/editor-area";
import styles from "./page.module.css";

export default function MainPage() {
  return (
    <main className={styles["editor-layout"]}>
      <EditorArea />
      <ControlBar />
    </main>
  );
}
