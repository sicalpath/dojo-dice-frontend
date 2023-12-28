"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import RoomInfo from "./RoomInfo";
import RoomRanking from "./RoomRanking";
import { PageContext } from "@/constants";
import LogPanel from "./LogPanel";
import { useWeb3MQLogin } from "@/hooks/useWeb3MQLogin";
import { Client, Web3MQDBValue } from "@web3mq/client";
import { useAccount } from "wagmi";
import Dice from "./Dice";
import Button from "./Button";
import { getNewGameId, randomHexAndCommitment } from "@/utils/commitment";
import { Battle } from "@/app/types";
import { keccak256 } from "viem";



export default function Room({
    ...props
}: {
    [key: string]: any;
}) {

    const { room, setRoom, logs, setLogs, web3mqClient, battle, setBattle } = useContext(PageContext);
    const { address, isConnecting } = useAccount();
    const { keys, fastestUrl, init, loginByRainbow, registerByRainbow, getUserAccount, logout } = useWeb3MQLogin();
    const [opDice, setOpDice] = useState(1);
    const [myDice, setMyDice] = useState(6);
    const [prepared, setPrepared] = useState<any>(-1);


    useEffect(() => {
        // init();
        console.log(keys);
    }, []);

    useEffect(() => {
        // const battle = JSON.parse(localStorage.getItem("battle") || "{}");
        if (battle?.oppoSeeds.value[0] != "") {
            //@ts-ignore
            const diceN = parseInt(keccak256(`0x${battle.mySeeds.value[1] + battle.oppoSeeds.value[0]}`).slice(-1), 16) % 6 + 1;
            setMyDice(diceN);
        }
    }, [battle?.oppoSeeds.value[0]])



    const handleEnteredRoom = () => {
        web3mqClient?.message.sendMessage(`[${new Date().toLocaleTimeString()}] I am in`, room);
        console.log(logs, web3mqClient)
    }

    const handleRoll = () => {
        setMyDice(Math.floor((Math.random() * 6) + 1))
    }

    const handlePrepare = useCallback(() => {
        const newBattle = {
            ...battle,
            gameId: getNewGameId(),
            roomId: room,
            mySeeds: randomHexAndCommitment(),
            running: false,
        };
        setBattle(newBattle);
        localStorage.setItem("battle", JSON.stringify(newBattle));
        waitForFuck();
        setPrepared(setInterval(() => {
            waitForFuck();
        }, 5000));
    }, [prepared])

    const handleStop = () => {
        clearInterval(prepared);
        setPrepared(-1);
    }

    const handleLock = () => {
        console.log(web3mqClient)
        // web3mqClient?.message.getMessageList({
        //     page: 1,
        //     size: 20,
        // }, room).catch((err: any) => {
        //     console.log(err, "err")
        // });
        console.log(battle?.mySeeds);
        console.log(localStorage.getItem("battle"))
    }


    const waitForFuck = () => {
        const battle = JSON.parse(localStorage.getItem("battle") || "{}")
        web3mqClient?.message.sendMessage(`Who want fuck me? My Commitment: ${battle?.gameId}:${battle?.mySeeds.hash.join(":")}`, room);
    }



    return (
        <div className="flex flex-col w-full z-20">

            {/* ROOM HEADER */}
            <div className="flex w-full mt-12 h-36">
                <RoomInfo text={`Room ${room}`} />
                <RoomRanking />
            </div>

            {/* ROOM BODY */}
            <div className="flex w-full gap-8">
                <div className="w-3/4 flex flex-col gap-5 items-center">
                    <div className="flex flex-col ml-auto text-base text-pink-600  w-full h-full overflow-auto bg-gray-100 bg-opacity-70 rounded-xl px-6 py-2 no-scrollbar items-center">
                        <div className="mr-auto opacity-50 font-bold select-none">{battle?.opponent.slice(0, 12)}</div>
                        <Dice number={opDice} className={`mt-16 ${battle?.opponent ? "rolling" : ""}`} />
                    </div>
                    <div className="flex flex-col ml-auto text-base text-pink-600  w-full h-full overflow-auto bg-gray-100 bg-opacity-70 rounded-xl px-6 py-2 no-scrollbar items-center">
                        <div className="mr-auto opacity-50 font-bold select-none">You</div>
                        <Dice number={myDice} className="mt-16" />
                        <div className="flex flex-row gap-3 mt-10">
                            <Button text={prepared == -1 ? "PREPARE" : "STOP"} onClick={() => { prepared == -1 ? handlePrepare() : handleStop() }} className='bg-pink-400 rounded-md px-6 text-sm text-white mt-3 tracking-wider transition duration-300' />
                            <Button text="ROLL" onClick={() => { handleRoll() }} className='bg-pink-400 rounded-md px-6 text-sm text-white mt-3 tracking-wider' />
                            <Button text="LOCK" onClick={() => { handleLock() }} className='bg-pink-400 rounded-md px-6 text-sm text-white mt-3 tracking-wider' />
                        </div>
                    </div>


                </div>
                <div className="w-1/4 h-[70vh] mr-7 ">
                    <LogPanel />
                </div>
            </div>
        </div>
    );
}
