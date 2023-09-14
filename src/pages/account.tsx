import type { NextPage } from "next";
import Head from "next/head";
import { AccountView } from "../views";

const Account: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Web3 AI</title>
        <meta
          name="description"
          content="Account Page"
        />
      </Head>
      <AccountView />
    </div>
  );
};

export default Account;
