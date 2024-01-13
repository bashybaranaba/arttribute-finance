"use client";

import { useModal } from "connectkit";
import { useAccount, useDisconnect } from "wagmi";

export default function Home() {
  const { isConnected, address, isConnecting } = useAccount();
  const { setOpen } = useModal();
  const { disconnect } = useDisconnect();
  if (isConnecting) return <div>Connecting...</div>;
  return (
    <div className="p-20">
      <div className="text-4xl">Arttribute Finance</div>
      {!isConnected && (
        <button
          className="p-2 rounded-md bg-blue-500 text-white"
          onClick={() => setOpen(true)}
        >
          Connect Wallet
        </button>
      )}
      {isConnected && (
        <div>
          <div>Connected: {address}</div>
          <button
            className="p-2 rounded-md bg-blue-500 text-white"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
