import type { NextPage } from "next";
import Head from "next/head";
import { PlaygroundView } from "../views";

const Playground: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Web3 AI</title>
        <meta
          name="description"
          content="Playground Page"
        />
      </Head>
      <PlaygroundView />
    </div>
  );
};

export default Playground;
