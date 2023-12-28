"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";

import { useAccount } from "wagmi";
import { emojiAvatarFromAddress } from "@/utils/emojiAvatarFromAddress";
import { PageContext } from "@/constants";
import { getNewGameId, randomHexAndCommitment } from "@/utils/commitment";
import { keccak256 } from "viem";
import { MsgType } from "@/app/types";



export default function LogPanel({
    ...props
}: {
    [key: string]: any;
}) {
    const { room, web3mqClient, battle, setBattle } = useContext(PageContext);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        // await web3mqClient?.channel.setActiveChannel(room)
        console.log(web3mqClient, room)
        web3mqClient?.message.getMessageList({
            page: 1,
            size: 20,
        }, room).then((messages: any) => {
            setLogs(messages.slice().reverse());
        }).catch((err: any) => {
            console.log(err, "wr")
        });
        web3mqClient?.on('message.delivered', handleMsgReceived);
        web3mqClient?.on('message.getList', handleMsgReceived);
        return () => {
            web3mqClient?.off('message.delivered');
            web3mqClient?.off('message.getList');
        };

    }, []);

    const handleMsgReceived = useCallback(async (event: any) => {
        //@ts-ignore
        const { messageList } = web3mqClient.message;
        if (!messageList) {
            return;
        }
        if (event?.type == "message.delivered") {
            messageList && setLogs(messageList?.slice().reverse());
            setTimeout(() => {
                handleGetMsg();
            }, 3000);
        }
        if (event?.type == "message.getList") {
            messageList && setLogs(messageList?.slice().reverse());
            setTimeout(() => {
                handleGetMsg();
            }, 3000);
        }
    }, [])

    const handleGetMsg = () => {
        web3mqClient?.message.getMessageList({
            page: 1,
            size: 20,
        }, room).catch((err: any) => {
            console.log(err, "err")
        });
    }




    const renderMsg = (msg: any) => {
        if (msg.content.indexOf(MsgType.Reveal) != -1) {
            (msg.senderId !== web3mqClient?.keys.userid) && handleRevealFirst(msg.senderId, msg.content);
            return (<div className="flex ">[{msg.timestamp}] <span className="text-blue-600">{msg.senderId.slice(0, 12)}</span>&nbsp; Revealed his first val.</div>);
        }
        if (msg.content.indexOf(MsgType.Fuck) != -1) {
            (msg.senderId !== web3mqClient?.keys.userid) && handleFucked(msg.senderId, msg.content);
            return (<div className="flex ">[{msg.timestamp}] <span className="text-blue-600">{msg.senderId.slice(0, 12)}:</span>&nbsp; {msg.content.slice(0, 24)}</div>);
        }
        if (msg.content.indexOf(MsgType.Prepared) != -1)
            return (<div className="flex ">[{msg.timestamp}] <span className="text-blue-600">{msg.senderId.slice(0, 12)}</span>&nbsp; is seeking for fuck.{msg.content.slice(-10)} {web3mqClient?.keys.userid !== msg.senderId && <span className="ml-auto bg-orange-500 text-white cursor-pointer border border-orange-500 rounded text-xs mt-auto" onClick={() => handleFuck(msg.senderId, msg.content)}>Fuck Him</span>}</div>)
        return (<div className="flex ">[{msg.timestamp}] <span className="text-blue-600">{msg.senderId.slice(0, 12)}:</span>&nbsp; {msg.content.slice(0, 24)}</div>)
    }

    const handleFuck = (user: string, content: string) => {
        const [gameId, ...oppoSeedsHash] = content.slice(-(32 + 64 + 64 + 2 + 2 + 2)).split(":")
        const mySeeds = randomHexAndCommitment();
        const newBattle = {
            opponent: user,
            gameId: gameId,
            roomId: room,
            oppoSeeds: { hash: oppoSeedsHash, value: ["", ""] },
            mySeeds: mySeeds,
            running: true,
            timestamp: Date.now(),
        };


        setBattle(newBattle);
        localStorage.setItem("battle", JSON.stringify(newBattle));

        web3mqClient?.message.sendMessage(`${MsgType.Fuck} ${user}. My Commitment: ${gameId}:${mySeeds.hash.join(":")}`, room);
        revealFirst();
        console.log(web3mqClient)
    }

    const handleFucked = (user: string, content: string) => {
        const [gameId, ...oppoSeedsHash] = content.slice(-(32 + 64 + 64 + 2 + 2 + 2)).split(":")
        if (gameId != battle?.gameId || battle?.running) return;
        const newBattle = {
            ...battle,
            opponent: user,
            oppoSeeds: { hash: oppoSeedsHash, value: ["", ""] },
            running: true,
            timestamp: Date.now(),
        };

        setBattle(newBattle);
        localStorage.setItem("battle", JSON.stringify(newBattle));
        revealFirst();
    }

    const revealFirst = () => {
        const battle = JSON.parse(localStorage.getItem("battle") || "{}")
        web3mqClient?.message.sendMessage(`${MsgType.Reveal} First value is: ${battle?.gameId}:${battle.mySeeds.value[0]}`, room);
    }

    const handleRevealFirst = (user: string, content: string) => {
        const [gameId, firstValue] = content.slice(-(32 + 32 + 1)).split(":")
        const battle = JSON.parse(localStorage.getItem("battle") || "{}");
        if (gameId != battle?.gameId || !battle?.running || battle?.oppoSeeds.value[0] != "") return;
        console.log(keccak256(`0x${firstValue}`), battle?.oppoSeeds.hash[0], "shoule be same")
        const tmpBattle = {
            ...battle,
            opponent: user,
            oppoSeeds: { hash: battle.oppoSeeds.hash, value: [firstValue, ""] },
            running: true,
            timestamp: Date.now(),
        };

        setBattle(tmpBattle);
        localStorage.setItem("battle", JSON.stringify(tmpBattle));
    }

    return (
        <div className="flex flex-col-reverse ml-auto text-base text-pink-600  w-full h-full overflow-hidden bg-gray-100 opacity-70 rounded-xl px-6 py-2 no-scrollbar  select-none">
            {logs?.reverse().map((msg: any) => renderMsg(msg))}
        </div>
    );
}
