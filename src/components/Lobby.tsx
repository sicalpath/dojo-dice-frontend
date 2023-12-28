"use client";
import { useContext, useEffect, useState, useRef, forwardRef } from "react";
import RoomEnter from "./RoomEnter";
import Input from '@/components/Input';
import Button from "./Button";
import { PageContext } from "@/constants";
import { useWeb3MQLogin } from "@/hooks/useWeb3MQLogin";

const roomIds = [
    "group:a1d4c7e1dd0052ee2b06f775b646f876b495d28d",
    "group:fe083b38c4ebea5086663e2368333e9ac1bd5436",
    "group:1f97ddbfbb8973d1354441c6582aca2a9c6d2665",
    "group:3a2de705303955b46f7a7c9792ad7e9171b0f062",
    "group:91c43cdd67ba7d54afd6293e4bab0098a25d5153",
    "group:90ea7f095a710e860917ad8b082f460817906cdc",
    "group:34816a428001c0ac3febc455b779f1212cc64dbb",

];
export default function Lobby({
    ...props
}: {
    [key: string]: any;
}) {

    const [active, setActive] = useState(-1);
    const [metadatas, setMetadatas] = useState<Object[] | undefined>([]);
    const { room, setRoom, logs, setLogs, web3mqClient } = useContext(PageContext);

    const roomRef = useRef(null!);

    useEffect(() => {
        // init();
        web3mqClient && setTimeout(() => {
            handleGetRooms();
            console.log("getting")
        }, 1000)
    }, [web3mqClient]);
    const handleJoinRoom = async () => {

        // const res = await joinRoom(roomIds[active]);
        //@ts-ignore
        const data = await web3mqClient?.channel.joinGroup(roomRef.current.value);
        console.log(data)
        //@ts-ignore
        setRoom(roomRef.current.value);

    }

    const handleGetRooms = async () => {

        const data = await web3mqClient?.channel.queryGroups(roomIds, true);
        console.log(data)
        setMetadatas(data);
        return data;
    }



    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-4 gap-2 ">
                {roomIds.map((id, index) => (//@ts-ignore
                    <RoomEnter id={index + 1} active={active == index} onClick={() => { setActive(index); roomRef.current.value = roomIds[index]; }} metadata={metadatas && metadatas[index]} />
                ))}
            </div>
            <div className='mt-5'>
                <div className="border-2 border-pink-300 rounded-md text-sm">
                    <input placeholder="roomId" ref={roomRef} className={`focus:outline-none rounded-md text-center text-gray-400 px-2  h-7`} />
                </div>
            </div>
            <Button text="JOIN" onClick={() => { handleJoinRoom() }} className='bg-pink-400 rounded-md px-6 text-sm text-white mt-3 tracking-wider' />
        </div>
    );
}
