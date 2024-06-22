import { CSSProperties, ComponentProps } from "react";

import style from "./skeleton.module.css";
import { cx } from "../../../lib/cva";

type SkeletonVariantProps =
  | {
      variant: "text";
      fontSize?: string;
    }
  | {
      variant: "circular" | "rectangular";
      height: number | string;
      width?: number | string;
    };

type SkeletonProps = ComponentProps<"div"> & SkeletonVariantProps;

export function Skeleton(props: SkeletonProps) {
  if (props.variant === "text") {
    const { variant, fontSize, className, style: propStyle, ...others } = props;
    return (
      <div
        className={cx(style.skeleton, style.skeleton_text, className as string)}
        style={{
          fontSize: fontSize ?? "medium",
          ...(propStyle as CSSProperties),
        }}
        {...others}
      ></div>
    );
  }

  const {
    variant,
    width,
    height,
    className,
    style: propsStyle,
    ...others
  } = props;
  return (
    <div
      className={cx(style.skeleton, className as string)}
      style={{
        height: props.height,
        width: props.width ?? (variant === "circular" ? props.height : "auto"),
        borderRadius: props.variant == "circular" ? "99vw" : 4,
        ...(propsStyle as CSSProperties),
      }}
      {...others}
    ></div>
  );
}
