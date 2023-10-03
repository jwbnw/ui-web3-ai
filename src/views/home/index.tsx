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
import HasAccountRequest from "models/HasAccountRequest";
import { HasAccount } from "services/UserService";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

type HomeViewProps = {
  hasAccount: boolean;
  hasToken: boolean;
};

export const HomeView: FC<HomeViewProps> = ({
  hasAccount,
  hasToken
}) => {
  
  const wallet = useWallet();
  const { connection } = useConnection();
  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  
  const [signedIn, setSignedIn] = useState(hasToken);
  const [hasKnownAccount, setHasKnownAccount] = useState(hasAccount);

  useEffect(() => {
    /* Leaving for reference later
    if (wallet.publicKey) {  
        getUserSOLBalance(wallet.publicKey, connection); // Leaving this for now as an example for later if needed
    } */

    setSignedIn(hasToken);
    setHasKnownAccount(hasAccount);
    if( wallet.publicKey && !hasKnownAccount){
      callHasKnownAccount();
    }
    else if(wallet.publicKey && hasKnownAccount && !signedIn){
      callTokenCheck();
    }
  }, [wallet, connection, getUserSOLBalance, signedIn, hasKnownAccount]);

  

  function callTokenCheck(){
    let tokenInStorage = localStorage.getItem("X-User-Token");
  
    if (tokenInStorage !== null) {
      setHasKnownAccount(true);
    } 
  }

  async function callHasKnownAccount() {
    console.log("calling has known account");
    
    const hasAccountRequest: HasAccountRequest = {
      publicKey: wallet.publicKey.toString(),
    };

    let accountCheck = await HasAccount(hasAccountRequest);
    setHasKnownAccount(accountCheck.hasAccount);
  }

  const MainBtnRender = () => {
    if (!wallet.publicKey) {
      {console.log("In 1nd else");}
      return (
        <div>
            <WalletMultiButtonDynamic className="btn btn-ghost btn-wide" />
        </div>
      );
    } else if (wallet.publicKey && !hasKnownAccount) {
      {console.log("In 2nd else");}
      return (
        <div>
              <button className="btn btn-primary w-3/4">CreateAccount</button>
        </div>
      );
    } else if(wallet.publicKey && hasAccount && !signedIn) {
      {console.log("In 3rd else");}
      return (
        <div>
          <button className="btn btn-primary w-3/4">Sign In</button>
        </div>
      );
    } else {
      {console.log("In last else");}
      return(
        <div>
          <button className="btn btn-primary w-3/4">Go To Playground!</button>
        </div>
      )
      }
    }

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
          <MainBtnRender />
        </div>
        { /* //Dev Airdrop Feature..Commenting out for now
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
            */}
      </div>
    </div>
  );
};
