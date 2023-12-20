import { createContext } from "react";

export const PageContext = createContext<{
  room: number;
  setRoom: (room: number) => void;
}>({ room: -1, setRoom: () => { } });
