"use client";
import React from "react";


export default function Input({
    value,
    placeholder,
    ref,
    className = "",
    ...props
}: {
    value: string;
    placeholder: string;
    className?: string;
    [key: string]: any;
}) {

    console.log(props, ref)

    return (
        <div className="border-2 border-pink-300 rounded-md text-sm">
            <input className={`${className} focus:outline-none rounded-md text-center  px-2  h-7`} {...props} placeholder={placeholder} />
        </div>
    );
}
