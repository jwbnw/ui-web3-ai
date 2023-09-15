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
      {/*Maybe PlaygroundSideBar should go here but not that big of a deal*/}
      <PlaygroundView />
    </div>
  );
};

export default Playground;
