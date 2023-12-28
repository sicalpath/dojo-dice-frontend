"use client";
import React, { useContext, useEffect } from "react";
import Button from '@/components/Button';
import ConnectButton from '@/components/ConnectButton'
import { useWeb3MQLogin } from "@/hooks/useWeb3MQLogin";
import { useAccount } from "wagmi";
import { PageContext } from "@/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";


export default function Configs({
    className = "",
    ...props
}: {
    className?: string;
    [key: string]: any;
}) {
    const { web3mqClient, setWeb3mqClient, setRoom } = useContext(PageContext);
    const { address, isConnecting } = useAccount();
    const { keys, client, fastestUrl, init, loginByRainbow, registerByRainbow, getUserAccount, logout, createRoom, sendMsg, getRooms, joinRoom } = useWeb3MQLogin();
    const { openConnectModal } = useConnectModal();

    useEffect(() => {
        init();



    }, []);

    useEffect(() => {
        client?.on('channel.activeChange', console.log);
        client?.on('channel.created', console.log);
        client?.on('message.delivered', console.log);
        client?.on('channel.getList', console.log);
        client?.on('channel.updated', console.log);
        //@ts-ignore
        setWeb3mqClient(client);
        return () => {
            client?.off('channel.activeChange');
            client?.off('channel.created');
            client?.off('message.delivered', console.log);
            client?.off('channel.getList');
            client?.off('channel.updated');
        };
    }, [client])

    const onEventHandler = (e: any) => {
        console.log("event", e)
    }

    const handleConnectWeb3MQ = async () => {
        if (!address && openConnectModal) {
            openConnectModal();
        }
        else {
            const { address: walletAddress, userExist } = await getUserAccount('metamask', address?.toLowerCase());
            if (!userExist) {
                await registerByRainbow('shit');
            } else {
                await loginByRainbow();
            }
        }

    }

    const handleCreateRoom = (id = "group:c61abf3ef71ea1597b4e4e4761b01f5ead154017", name = "DOI HOUSE") => {
        createRoom("", name)
    }

    const handleSendMsg = () => {
        sendMsg(new Date().toUTCString(), 'group:a1d4c7e1dd0052ee2b06f775b646f876b495d28d')
    }

    const handleTest = () => {
        const ids = [
            "group:a1d4c7e1dd0052ee2b06f775b646f876b495d28d",
            "group:e3c5972b9a52afff9d3b2571bcf641b0a00e91b3",
            "group:60838dbd92b4ca1135128f6e2504de896ea84d33",
            "group:bfde4500ccae7c132a22c21b6bac7313c96e1bc5",
            "group:d92f8cbde3f4723b519fbb5bd8c6ec5fa3d4473d",
            "group:f78e115d377d7c60f19526634aa35a3bd55941ce",
            "group:a8cb322d5fd256f9b3c443f8f867a9882bda0526",
            "group:59657a082f34bc9f1598ea00b5a3f53587d3c2f9",
            "group:3e37e67c835ff2804cafe93b03f5359794f83a3a",
        ];
        getRooms(ids);
    }



    return (

        <div
            className={` ${className} select-none flex flex-row gap-5`}
            {...props}
        >
            <ConnectButton className="bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider" />
            <Button text={web3mqClient != undefined ? 'Connected' : 'WEB3MQ'} onClick={handleConnectWeb3MQ} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' />
            {/* <Button text={'Create'} onClick={() => { handleCreateRoom() }} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' />
            <Button text={'Send'} onClick={handleSendMsg} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' />
            <Button text={'Get'} onClick={handleTest} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' /> */}
            <Button text={'Logout'} onClick={logout} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' />
        </div>
    );
}
