"use client";
import React, { useContext, useEffect, useState } from "react";
import RoomInfo from "./RoomInfo";
import RoomRanking from "./RoomRanking";
import { PageContext } from "@/constants";
import LogPanel from "./LogPanel";
import { useWeb3MQLogin } from "@/hooks/useWeb3MQLogin";
import { Client } from "@web3mq/client";
import { useAccount } from "wagmi";



export default function Room({
    ...props
}: {
    [key: string]: any;
}) {

    const { room, setRoom, logs, pushLog, web3mqClient } = useContext(PageContext);
    const { address, isConnecting } = useAccount();
    const { keys, fastestUrl, init, loginByRainbow, registerByRainbow, getUserAccount, logout } = useWeb3MQLogin();

    useEffect(() => {
        init();
    }, []);


    const handlePushLog = () => {
        pushLog(new Date().toUTCString())

        console.log(web3mqClient)
    }



    return (
        <div className="flex flex-col w-full z-20">

            {/* ROOM HEADER */}
            <div className="flex w-full">
                <RoomInfo text={`Room ${room + 1}`} />
                <RoomRanking />
            </div>

            {/* ROOM BODY */}
            <div className="flex w-full gap-8">
                <div className="w-3/4 flex flex-col gap-5">
                    1
                    <button onClick={handlePushLog}>add</button>

                    <button onClick={loginByRainbow}>log</button>
                    <button onClick={() => registerByRainbow("fick")}>reg</button>
                    <button onClick={() => getUserAccount('metamask', address)}>get</button>
                </div>
                <div className="w-1/4 h-[70vh] mr-7 ">
                    <LogPanel />
                </div>
            </div>
        </div>
    );
}
