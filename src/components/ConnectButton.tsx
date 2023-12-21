"use client";
import React from "react";
import { ConnectButton as CB } from "@rainbow-me/rainbowkit";

export default function ConnectButton({
  className = "",
  ...props
}: {

  className?: string;
  [key: string]: any;
}) {
  return (
    <CB.Custom>
      {({ account, chain, openChainModal, openConnectModal, openAccountModal, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div className={`mx-auto flex hover:scale-105 disabled:opacity-50 disabled:scale-100 text-center select-none cursor-pointer py-1 transition duration-300 ${className} `}>
            {(() => {
              if (!connected) {
                return (
                  <a className="mx-auto" onClick={openConnectModal}>
                    Connect
                  </a>
                );
              }

              if (chain.unsupported) {
                return (
                  <a
                    onClick={openChainModal}
                    className="text-red-500 dark:text-red-600 mx-auto"
                  >
                    Wrong network
                  </a>
                );
              }

              return (
                <div className="flex flex-col gap-2 mx-auto">
                  <div className="flex " onClick={openAccountModal}>
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                        }}
                        className="overflow-hidden w-4 h-4 rounded-full mr-1 my-auto"
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain"}
                            src={chain.iconUrl}
                          />
                        )}
                      </div>
                    )}
                    {account.displayName}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </CB.Custom>
  );
}
