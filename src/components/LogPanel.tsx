"use client";
import React, { useContext, useState } from "react";

import { useAccount } from "wagmi";
import { emojiAvatarFromAddress } from "@/utils/emojiAvatarFromAddress";
import { PageContext } from "@/constants";

export default function LogPanel({
    ...props
}: {
    [key: string]: any;
}) {
    const { logs, pushLog } = useContext(PageContext);



    return (
        <div className="flex flex-col-reverse ml-auto text-base text-pink-600  w-full h-full overflow-auto bg-gray-100 opacity-70 rounded-xl px-6 py-2 no-scrollbar">
            {logs.map(log => (<p>{log}</p>))}
        </div>
    );
}
