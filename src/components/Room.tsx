"use client";
import React, { useContext, useState } from "react";
import RoomInfo from "./RoomInfo";
import RoomRanking from "./RoomRanking";
import { PageContext } from "@/constants";



export default function Room({
    ...props
}: {
    [key: string]: any;
}) {

    const { room, setRoom } = useContext(PageContext);


    return (
        <div className="flex flex-col w-full">

            {/* ROOM HEADER */}
            <div className="flex w-full">
                <RoomInfo text={`Room ${room + 1}`} />
                <RoomRanking />
            </div>

            {/* ROOM BODY */}
            <div className="flex w-full gap-8">
                <div className="w-3/4">
                    1
                </div>
                <div className="w-1/4">
                    2
                </div>
            </div>
        </div>
    );
}
