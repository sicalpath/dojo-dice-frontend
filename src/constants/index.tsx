import { createContext } from "react";
import { Client, KeyPairsType, WalletType } from '@web3mq/client';


export const PageContext = createContext<{
  room: number;
  setRoom: (room: number) => void;
  logs: string[];
  pushLog: (text: string) => void;
  web3mqClient: Client | undefined;
  setWeb3mqClient: (client: Client) => void;
}>({ room: -1, setRoom: () => { }, logs: [], pushLog: () => { }, web3mqClient: undefined, setWeb3mqClient: () => { } });
