"use client";
import React, { useState } from "react";

import { useAccount } from "wagmi";
import { emojiAvatarFromAddress } from "@/utils/emojiAvatarFromAddress";

export default function RoomRanking({
    ...props
}: {
    [key: string]: any;
}) {
    const { address, isConnecting } = useAccount();




    return (
        <div className="flex flex-col ml-auto mr-20 text-xl font-semibold text-pink-600">
            <p>Players</p>
            <p>{emojiAvatarFromAddress(address || "").emoji}</p>

        </div>
    );
}
