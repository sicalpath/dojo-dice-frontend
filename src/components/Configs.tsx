"use client";
import React, { useContext, useEffect } from "react";
import Button from '@/components/Button';
import ConnectButton from '@/components/ConnectButton'
import { useWeb3MQLogin } from "@/hooks/useWeb3MQLogin";
import { useAccount } from "wagmi";
import { Client, DidType } from "@web3mq/client";
import { PageContext } from "@/constants";
import useLogin from "@/hooks/useLogin";


export default function Configs({
    className = "",
    ...props
}: {
    className?: string;
    [key: string]: any;
}) {
    const { web3mqClient, setWeb3mqClient } = useContext(PageContext);
    const { address, isConnecting } = useAccount();
    const { keys, fastestUrl, init, loginByRainbow, registerByRainbow, getUserAccount, logout, createRoom, sendMsg } = useWeb3MQLogin();


    useEffect(() => {
        init();
        // console.log(keys)
        // const client = Client.getInstance(keys);
        // console.log(client)

        const client = Client.getInstance(keys);
        client.on('channel.activeChange', console.log);
        client.on('channel.created', console.log);
        client.on('message.delivered', console.log);
        client.on('channel.getList', console.log);
        client.on('channel.updated', console.log);
    }, []);

    const handleConnectWeb3MQ = async () => {
        const { address: walletAddress, userExist } = await getUserAccount('metamask', address?.toLowerCase());
        if (!userExist) {
            await registerByRainbow('shit');
        } else {
            await loginByRainbow();
        }
        // //@ts-ignore
        // const client = Client.getInstance(keys);
        // console.log(client)
        // setWeb3mqClient(client);
    }

    const handleCreateRoom = (name = "FUCK HOUSE") => {
        createRoom(name)
    }

    const handleSendMsg = () => {
        sendMsg(new Date().toUTCString(), 'group:c61abf3ef71ea1597b4e4e4761b01f5ead154017')
    }


    return (

        <div
            className={` ${className} select-none flex flex-row gap-5`}
            {...props}
        >
            <ConnectButton className="bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider" />
            <Button text={web3mqClient != undefined ? 'Connected' : 'WEB3MQ'} onClick={handleConnectWeb3MQ} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' />
            <Button text={'Create'} onClick={() => { handleCreateRoom("hah") }} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' />
            <Button text={'Send'} onClick={handleSendMsg} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' />
            <Button text={'Logout'} onClick={logout} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' />
        </div>
    );
}
