// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="mt-6">
          <div className="text-sm font-normal align-bottom text-right text-slate-600 mt-4">
            v{pkg.version}
          </div>
          <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            Web 3 AI
          </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p>Create, Save and Share your Dreams</p>
          <p className="text-slate-500 text-2x1 leading-relaxed">
            Powered By Solana
          </p>
        </h4>
        <div className="relative group">
          {/*Once we have the thrid option of sign in we'll abstract into a render function as we'll have 3 options*/}
          {!wallet.publicKey ? (
            <WalletMultiButtonDynamic className="btn btn-ghost btn-wide" />
          ) : (
            <button className="btn btn-xl btn-ghost btn-wide">
              Create Account
            </button>
          )}
        </div>
        <div className="flex flex-col mt-2">
          <RequestAirdrop />
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
            {wallet && (
              <div className="flex flex-row justify-center">
                <div>{(balance || 0).toLocaleString()}</div>
                <div className="text-slate-600 ml-2">SOL (For Dev Testing)</div>
              </div>
            )}
          </h4>
        </div>
      </div>
    </div>
  );
};
