import { createContext } from "react";

export const PageContext = createContext<{
  room: number;
  setRoom: (room: number) => void;
  logs: string[];
  pushLog: (text: string) => void;
}>({ room: -1, setRoom: () => { }, logs: [], pushLog: () => { } });
