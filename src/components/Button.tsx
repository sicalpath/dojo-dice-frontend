"use client";
import React from "react";


export default function Button({
    text,
    onClick,
    className = "",
    ...props
}: {
    text: string;
    onClick: any;
    className?: string;
    [key: string]: any;
}) {


    return (

        <button
            className={`hover:scale-105 disabled:opacity-50 disabled:scale-100 text-center select-none cursor-pointer py-1 transition duration-300 ${className} `}
            onClick={onClick}
            {...props}
        >
            {text}
        </button>
    );
}
