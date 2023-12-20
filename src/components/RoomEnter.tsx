"use client";
import React from "react";


export default function RoomEnter({
    id,
    active,
    ...props
}: {
    id: number;
    active: boolean;
    [key: string]: any;
}) {


    return (
        <div className={`flex mx-2 w-32 border-2 border-pink-300 ${active ? "bg-pink-200" : "bg-pink-100"} rounded-md px-1 py-0.5 text-sm cursor-pointer select-none text-pink-700 transition duration-300`} {...props}>
            <span className="mr-auto">房间 {id}</span>
            <span className="ml-auto">3 / 10</span>
        </div>
    );
}
