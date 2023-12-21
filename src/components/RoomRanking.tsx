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
        <div className="flex flex-col ml-auto mr-8 text-xl font-semibold text-pink-600">
            <p>Players</p>
            <p>{emojiAvatarFromAddress(address || "").emoji}1</p>
            <p>111</p>
            <p>214</p>
            <p>136</p>
        </div>
    );
}
