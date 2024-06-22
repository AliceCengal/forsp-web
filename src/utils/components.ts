import { ReactElement } from "react";

export type PropsWithChildElem<T = {}> = T & { children: ReactElement };
