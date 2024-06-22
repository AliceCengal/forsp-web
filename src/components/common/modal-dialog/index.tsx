import { CSSProperties, PropsWithChildren, useEffect, useRef } from "react";

export type DialogProps = PropsWithChildren<{
  open: boolean;
  onClose?: () => void;
}>;

const DIALOG_STYLE = {
  padding: "0px",
  border: "none",
  width: "100vw",
  backgroundColor: "transparent",
};

export function Dialog({ open, onClose, children }: DialogProps) {
  const dref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dref.current?.showModal();
    } else {
      dref.current?.close();
    }
  }, [open]);

  useEffect(() => {
    if (!onClose) return;

    const dialog = dref.current;
    if (!dialog) return;

    dialog.addEventListener("close", onClose);

    return () => {
      dialog.removeEventListener("close", onClose);
    };
  }, [onClose]);

  useEffect(() => {
    const dialog = dref.current;
    if (!dialog) return;

    const handler = (event: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      if (!rect) return;
      const isInDialog = isInside(rect, event);
      if (!isInDialog) {
        dialog.close();
      }
    };

    dialog.addEventListener("click", handler);

    return () => {
      dialog.removeEventListener("click", handler);
    };
  }, []);

  return (
    <dialog ref={dref} style={DIALOG_STYLE}>
      {children}
    </dialog>
  );
}

function isInside(
  rect: { top: number; left: number; width: number; height: number },
  point: { clientX: number; clientY: number }
) {
  return (
    rect.top <= point.clientY &&
    point.clientY <= rect.top + rect.height &&
    rect.left <= point.clientX &&
    point.clientX <= rect.left + rect.width
  );
}

const DIALOG_ACTIONS_STYLE: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "var(--sp-2)",
};

export function DialogActions({ children }: PropsWithChildren) {
  return <div style={DIALOG_ACTIONS_STYLE}>{children}</div>;
}
