import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Web3 AI</title>
        <meta
          name="description"
          content="Web3 AI"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
