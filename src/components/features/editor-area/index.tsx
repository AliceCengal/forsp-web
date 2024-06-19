import CodeMirror from "@uiw/react-codemirror";
import { useState } from "react";
import { solarizedDark } from "@uiw/codemirror-theme-solarized";
import styles from "./editor-area.module.css";

export function EditorArea() {
  const [value, setValue] = useState("");
  return (
    <div className={styles["editor-container"]}>
      <CodeMirror theme={solarizedDark} value={value} onChange={setValue} />
    </div>
  );
}
