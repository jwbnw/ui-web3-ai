// Next, React
import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import HasAccountRequest from "models/HasAccountRequest";
import {
  CreateAccount,
  CreateOrUpdateLocalUserStorage,
  HasAccount,
  SignIn,
} from "services/UserService";
import { Console } from "console";
import CreateAccountRequest from "models/CreateAccountRequest";
import { notify } from "utils/notifications";

import bs58 from "bs58";
import SignInRequest from "models/SignInRequest";
import { Router } from "next/router";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

type HomeViewProps = {
  hasAccount: boolean;
  hasToken: boolean;
};

export const HomeView: FC<HomeViewProps> = ({ hasAccount, hasToken }) => {
  const { publicKey, signMessage } = useWallet();
  const { connection } = useConnection();
  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  const [signedIn, setSignedIn] = useState(hasToken);
  const [hasKnownAccount, setHasKnownAccount] = useState(hasAccount);

  const router = useRouter();

  //TODO: We're doing too many renders. fix that
  useEffect(() => {
    /* Leaving for reference later
    if (wallet.publicKey) {  
        getUserSOLBalance(wallet.publicKey, connection); // Leaving this for now as an example for later if needed
    } */
    setSignedIn(hasToken);
    setHasKnownAccount(hasAccount);
  }, [hasToken, hasAccount]);

  // centralize this
  const signServerChallenge = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Wallet not connected");
      if (!signMessage)
        throw new Error(
          'Wallet does not support message signing! - "See Wallet Sign Unsupported" in docs'
        );

      const message = new TextEncoder().encode("HashFromServer");
      const signedHash = await signMessage(message);

      var encodedSignedHash = bs58.encode(signedHash);

      console.log(
        "encoded signature at signServerChallenge(): ",
        encodedSignedHash
      );
      notify({
        type: "success",
        message: "Sign message successful!",
        txid: bs58.encode(signedHash),
      });

      return encodedSignedHash;
    } catch (err: any) {
      notify({
        type: "error",
        message: `Sign Message failed!`,
        description: err?.message,
      });
      console.log("error", `Sign Message failed! ${err?.message}`);
    }
  }, [publicKey, notify, signMessage]);

  function callTokenCheck() {
    let tokenInStorage = localStorage.getItem("X-User-Token");

    if (tokenInStorage !== null) {
      setSignedIn(true);
    }
  }

  async function callHasKnownAccount() {
    console.log("calling has known account");

    const hasAccountRequest: HasAccountRequest = {
      publicKey: publicKey.toString(),
    };

    let accountCheck = await HasAccount(hasAccountRequest);
    setHasKnownAccount(accountCheck.hasAccount);
  }

  async function callCreateAccount() {
    const signedHashValue = await signServerChallenge();

    const createAccountRequest: CreateAccountRequest = {
      signedHash: signedHashValue,
      publicKey: publicKey.toString(),
    };

    const createAccountResult = await CreateAccount(createAccountRequest);

    if (createAccountResult.userId !== "") {
      setSignedIn(true);
      setHasKnownAccount(true);
      CreateOrUpdateLocalUserStorage(createAccountResult);
      notify({
        type: "success",
        message: "Account Created!",
      });
    } else {
      notify({
        type: "error",
        message: "Something went wrong, please try again later",
      });
      console.log("Did not recieve user id from backend something went wrong");
    }
  }

  async function callSignIn() {
    const signedHashValue = await signServerChallenge();
    let wallet = publicKey.toString();

    const signInRequest: SignInRequest = {
      signedHash: signedHashValue,
      publicKey: wallet,
    };

    const signInResult = await SignIn(signInRequest);

    if (signInResult.userId !== "") {
      setSignedIn(true);
      setHasKnownAccount(true);
      CreateOrUpdateLocalUserStorage(signInResult);
      notify({
        type: "success",
        message: "Welcome!",
      });
    } else {
      notify({
        type: "error",
        message: "Something went wrong!",
      });
      console.log("Did not recieve user id from backend something went wrong");
    }
  }

  const handleCreateAccountBtnClick = () => {
    callCreateAccount();
  };

  const handleSignInBtnClick = () => {
    callSignIn();
  };

  const handlePlaygroundBtnClick = () => {
    router.push("/playground");
  };

  const MainBtnRender = () => {
    if (!publicKey) {
      {
        console.log("In 1nd else");
      }
      return (
        <div>
          <WalletMultiButtonDynamic className="btn btn-ghost btn-wide" />
        </div>
      );
    } else if (publicKey && !hasKnownAccount) {
      {
        console.log("In 2nd else");
      }
      return (
        <div>
          <button
            onClick={handleCreateAccountBtnClick}
            className="btn btn-primary w-3/4"
          >
            CreateAccount
          </button>
        </div>
      );
    } else if (publicKey && hasAccount && !signedIn) {
      {
        console.log("In 3rd else");
      }
      return (
        <div>
          <button
            onClick={handleSignInBtnClick}
            className="btn btn-primary w-3/4"
          >
            Sign In
          </button>
        </div>
      );
    } else {
      {
        console.log("In last else");
      }
      return (
        <div>
          <button
            onClick={handlePlaygroundBtnClick}
            className="btn btn-primary w-3/4"
          >
            Go To Playground!
          </button>
        </div>
      );
    }
  };

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
        {/* //Dev Airdrop Feature..Commenting out for now
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
