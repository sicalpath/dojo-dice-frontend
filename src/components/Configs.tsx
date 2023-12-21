"use client";
import React, { useContext, useEffect } from "react";
import Button from '@/components/Button';
import ConnectButton from '@/components/ConnectButton'
import { useWeb3MQLogin } from "@/hooks/useWeb3MQLogin";
import { useAccount } from "wagmi";
import { Client } from "@web3mq/client";
import { PageContext } from "@/constants";


export default function Configs({
    className = "",
    ...props
}: {
    className?: string;
    [key: string]: any;
}) {
    const { web3mqClient, setWeb3mqClient } = useContext(PageContext);
    const { address, isConnecting } = useAccount();
    const { keys, fastestUrl, init, loginByRainbow, registerByRainbow, getUserAccount, logout } = useWeb3MQLogin();

    useEffect(() => {
        init();
    }, []);

    const handleConnectWweb3MQ = async () => {
        const { address: walletAddress, userExist } = await getUserAccount('metamask', address);
        if (!userExist) {
            registerByRainbow('shit');
        } else {
            loginByRainbow();
        }
        //@ts-ignore
        const client = Client.getInstance(keys);
        console.log(client)
        setWeb3mqClient(client);
    }



    return (

        <div
            className={` ${className} select-none flex flex-row gap-5`}
            {...props}
        >
            <ConnectButton className="bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider" />
            <Button text={web3mqClient != undefined ? 'Connected' : 'WEB3MQ'} onClick={handleConnectWweb3MQ} className='bg-pink-400 rounded-md px-3 text-sm text-white mt-3 tracking-wider' disabled={web3mqClient != undefined} />
        </div>
    );
}
