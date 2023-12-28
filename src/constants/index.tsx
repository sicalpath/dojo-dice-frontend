import { createContext } from "react";
import { Client, KeyPairsType, WalletType } from '@web3mq/client';
import { Battle, Seeds } from "@/app/types";


export const PageContext = createContext<{
  room: string;
  setRoom: (room: string) => void;
  logs: string[];
  setLogs: (text: any) => void;
  web3mqClient: Client | undefined;
  setWeb3mqClient: (client: Client) => void;
  battle: Battle | undefined;
  setBattle: (battle: any) => void;
}>({ room: "", setRoom: () => { }, logs: [], setLogs: () => { }, web3mqClient: undefined, setWeb3mqClient: () => { }, battle: undefined, setBattle: () => { } });
