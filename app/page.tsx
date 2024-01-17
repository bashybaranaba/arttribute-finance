"use client";
import { useModal } from "connectkit";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import { AssetsCard } from "@/components/assets-card";
import { BorrowCard } from "@/components/borrow-card";
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";

export default function Home() {
  const { isConnected, address, isConnecting } = useAccount();
  const { setOpen } = useModal();
  const { disconnect } = useDisconnect();

  const balanceResult = useBalance({ address: address });
  const myAssets = balanceResult?.data;
  const Account = useAccount();
  console.log("balanceResult", balanceResult);
  console.log("Account", Account);
  console.log("address", address);
  console.log("Assets", myAssets);
  if (isConnecting) return <div>Connecting...</div>;
  return (
    <>
      <div className="md:hidden"></div>
      <div className="flex flex-col md:flex">
        <div className="fixed top-0 left-0 right-0 z-10 bg-white">
          <div className="border-b">
            <div className="flex h-16 items-center lg:px-8">
              <Logo text="Arttribute Finance" />
              <div className=" items-center justify-center">
                <MainNav className="hidden lg:flex mx-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16"></div>
      <div className="p-20">
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
            <div> myAssets:</div>
            <div className="mt-6">Hello</div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <AssetsCard />
          </div>
          <div className="col-span-1">
            <BorrowCard />
          </div>
        </div>
      </div>
    </>
  );
}
