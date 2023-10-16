import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { HasAccount } from "services/UserService";
import HasAccountRequest from "models/HasAccountRequest";
import { GetLocalUserStorage } from "services/UserService";

const Home: NextPage = (props) => {
  const [tokenExists, setTokenExists] = useState(false);
  const [hasKnownAccount, setHasKnownAccount] = useState(false);
  const { publicKey } = useWallet();

  useEffect(() => {
    // This is a super hacky way to do it. I need to build a token class or
    // something similar that handles the token, checking if valid, managment
    // etc.
    let tokenInStorage = localStorage.getItem("X-User-Token");

    if (tokenInStorage !== null) {
      handleTokenExists();
    } else if (publicKey) {
      callHasKnownAccount();
    }
  }, [tokenExists, hasKnownAccount]);

  async function callHasKnownAccount() {
    console.log("calling has known account");

    const hasAccountRequest: HasAccountRequest = {
      publicKey: publicKey.toString(),
    };

    let accountCheck = await HasAccount(hasAccountRequest);

    setHasKnownAccount(accountCheck.hasAccount); // TypeError: Cannot read properties of undefined (reading 'hasAccount') when navigating away and back to (when  backend is not running)
  }

  function handleTokenExists() {
    setTokenExists(true);
    setHasKnownAccount(true);
  }

  return (
    <div>
      <Head>
        <title>Web3 AI - Live Beta</title>
        <meta name="description" content="Web3 AI" />
      </Head>
      <HomeView hasAccount={hasKnownAccount} hasToken={tokenExists} />
    </div>
  );
};

export default Home;
