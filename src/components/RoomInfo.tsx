"use client";
import { PageContext } from "@/constants";
import React, { useContext, useState } from "react";



export default function RoomInfo({
    text,
    ...props
}: {
    text: string;
    [key: string]: any;
}) {

    const { room, setRoom } = useContext(PageContext);


    return (
        <div className="flex ml-8 text-xl font-bold text-pink-600 z-20">
            <div className=" text-xl font-bold " onClick={() => setRoom(-1)}>⬅️</div>
            <div className="">{text}</div>
        </div>
    );
}
