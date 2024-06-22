import { cva } from "../../../lib/cva";
import style from "./spinner.module.css";

export const spinner = cva(["spinner", style.spinner], {
  variants: {
    size: {
      small: style.spinner_sm,
      regular: style.spinner_md,
      large: style.spinner_lg,
      xlarge: style.spinner_xlg,
    },
    kind: {
      front: style.spinner_front,
      con: style.spinner_con,
      back: style.spinner_back,
    },
  },
  defaultVariants: {
    size: "regular",
    kind: "front",
  },
});
