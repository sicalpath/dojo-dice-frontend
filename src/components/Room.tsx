"use client";
import React, { useContext, useState } from "react";
import RoomInfo from "./RoomInfo";
import RoomRanking from "./RoomRanking";
import { PageContext } from "@/constants";
import LogPanel from "./LogPanel";



export default function Room({
    ...props
}: {
    [key: string]: any;
}) {

    const { room, setRoom } = useContext(PageContext);
    const { logs, pushLog } = useContext(PageContext);

    const handlePushLog = () => {
        pushLog(new Date().toUTCString())
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
                <div className="w-3/4">
                    1
                    <button onClick={handlePushLog}>add</button>
                </div>
                <div className="w-1/4 h-[70vh] mr-7 ">
                    <LogPanel />
                </div>
            </div>
        </div>
    );
}
