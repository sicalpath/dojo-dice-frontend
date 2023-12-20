"use client";
import React, { useContext, useState } from "react";
import RoomEnter from "./RoomEnter";
import Input from '@/components/Input';
import Button from "./Button";
import { PageContext } from "@/constants";


export default function Lobby({
    ...props
}: {
    [key: string]: any;
}) {

    const [active, setActive] = useState(0);
    const { room, setRoom } = useContext(PageContext);

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-4 gap-2 ">
                {Array.from(Array(12).keys()).map((id, index) => (
                    <RoomEnter id={id + 1} active={active == index} onClick={() => setActive(index)} />
                ))}
            </div>
            <div className='mt-5'>
                <Input value='' />
            </div>
            <Button text="JOIN" onClick={() => { setRoom(active) }} className='bg-pink-400 rounded-md px-6 text-sm text-white mt-3 tracking-wider' />
        </div>
    );
}
