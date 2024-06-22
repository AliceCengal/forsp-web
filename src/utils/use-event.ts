import { useCallback, useLayoutEffect, useRef } from "react";

export function useEvent(handler: any) {
  const handlerRef = useRef(null);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: any[]) => {
    // In a real implementation, this would throw if called during render
    const fn: any = handlerRef.current;
    return fn(...args);
  }, []);
}
