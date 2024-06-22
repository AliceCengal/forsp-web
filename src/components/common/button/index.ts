import { cva } from "../../../lib/cva";

import styles from "./button.module.css";

export const button = cva(styles.base, {
  variants: {
    kind: {
      bold: styles.bold,
      soft: styles.soft,
      line: styles.line,
      text: styles.text,
      tab: styles.tab,
    },
    size: {
      small: styles.small,
      regular: styles.regular,
      large: styles.large,
    },
    justifyContent: {
      center: styles.center,
      start: styles.start,
      end: styles.end,
    },
    active: {
      true: styles.active,
      false: "",
    },
  },
  defaultVariants: {
    kind: "soft",
    size: "regular",
    justifyContent: "center",
    active: false,
  },
});
