import { ReactNode, ComponentType, createElement as h } from "react";

import { panel } from "../panel";

type TabPanelProps<T> = {
  value: T;
  index: T;
  component?: ComponentType;
  render?: () => ReactNode;
  keepMounted?: boolean;
};

export function TabPanel<T>({
  value,
  index,
  component: Comp,
  render,
  keepMounted,
}: TabPanelProps<T>) {
  const isShow = value === index;

  return (
    <div
      style={{
        display: isShow ? "block" : "none",
      }}
      className={panel({ kind: "conBack", tabPanel: true })}
    >
      {!isShow && !keepMounted
        ? null
        : typeof Comp !== "undefined"
        ? h(Comp, null)
        : typeof render !== "undefined"
        ? render()
        : null}
    </div>
  );
}
