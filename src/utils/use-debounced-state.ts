import { useEffect, useState } from "react";
import { useEvent } from "./use-event";

type Options<T> = {
  delay: number;
  onChange?: (v: T) => void;
};

export function useDebouncedState<T>(
  initValue: T,
  { delay, onChange }: Options<T>
) {
  const [value, setValue] = useState(initValue);
  const [debValue, setDebValue] = useState(initValue);

  const update = useEvent(() => {
    setDebValue(value);
    if (onChange) {
      onChange(value);
    }
  });

  useEffect(() => {
    const t = setTimeout(update, delay);

    return () => {
      clearTimeout(t);
    };
  }, [value]);

  return [value, setValue, debValue] as const;
}
