
export type Seeds = {
    value: [string, string];
    hash: [string, string];
}

export type Battle = {
    gameId: string;
    roomId: string;
    opponent: string;
    mySeeds: Seeds;
    oppoSeeds: Seeds;
    running: boolean;
    timestamp: number;
}

export enum MsgType {
    Prepared = "Who want fuck me?",
    Fuck = "Fuck you!!!",
    Reveal = "I am revealing first value."
}
