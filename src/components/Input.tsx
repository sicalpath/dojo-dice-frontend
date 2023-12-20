"use client";
import React from "react";


export default function Input({
    value,
    className = "",
    ...props
}: {
    value: string;
    className?: string;
    [key: string]: any;
}) {


    return (
        <div className="border-2 border-pink-300 rounded-md text-sm">
            <input className={`${className} focus:outline-none rounded-md text-center  px-2  h-7`} {...props} placeholder="Nickname" />
        </div>
    );
}
