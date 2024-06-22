import { useEffect, useState } from "react";

export function useBlobUrl(data: string, type: string = "application/json") {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const blob = new Blob([data], { type });
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => {
      URL.revokeObjectURL(u);
      setUrl("");
    };
  }, [data, type]);

  return url;
}
