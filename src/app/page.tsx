"use client";

import Lobby from '@/components/Lobby';
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react';
import { useAccount } from "wagmi";
import { PageContext } from "@/constants";
import Room from '@/components/Room';
import Configs from '@/components/Configs';


export default function Home() {
  const { address, isConnecting } = useAccount();
  const { room, setRoom } = useContext(PageContext);
  const [active, setActive] = useState(-1);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

  }, [address]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="flex min-h-screen h-full w-screen flex-col items-center relative">
      <div className="fixed w-full h-[calc(100%+12.5rem)] pattern-checks-xl bg-[#db7be46e] text-[#ad22af4f] opacity-50 background blur-[2px]"></div>


      {room == -1 ? (<div className='flex flex-col items-center z-20'>
        <div className='text-5xl text-pink-800 mt-20'>
          Fuck You Dice!
        </div>
        <Configs />
        <div className='flex flex-col items-center mt-36'>
          <Lobby />
        </div>
      </div>
      ) : (<Room />)}

    </main>
  )
}
