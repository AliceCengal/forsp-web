"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { PropsWithChildren, ReactNode } from "react";

type MenuProps = PropsWithChildren & {
  trigger: ReactNode;
  align?: "start" | "center" | "end";
};

export function Menu({ trigger, align, children }: MenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align={align ?? "center"}>
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export const MenuItem = DropdownMenu.Item;
