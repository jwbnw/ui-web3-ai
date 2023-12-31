import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { FC, useRef, useState } from "react";
import { PaymentPresenter } from "./PaymentPresenter";
import {
  TextToArtTranscationRequest,
  Text_Prompt,
} from "models/TextToArtTranscationRequest";
import { TextToArtTranscationResponse } from "models/TextToArtTranscationResponse";
import { GenerateTextToArtResult } from "../services/TextToArtService";
import TransactionDetail from "models/TransactionDetail";
import { notify } from "../utils/notifications";
import { TextToArtImageViewer } from "./TextToArtImageViewer";
import dynamic from "next/dynamic";

export const AiArtComponent: React.FC = () => {
  const [modelValue, setModelValue] = useState("");
  const [presetStyle, setpresetStyle] = useState("None");
  const [costSol, setCostSol] = useState(0);
  const [costUsd, setCostUsd] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalDataRaw, setImageModalDataRaw] = useState("");
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);

  const posInputRef = useRef(null);
  const negInputRef = useRef(null);
  const presetStyleRef = useRef(null);
  const cfgRef = useRef(null);
  const stepsRef = useRef(null);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  function handleAiModelChage(newval: string) {
    setModelValue(newval); // make this value an enum
  }

  function handleStyleOption(newval: string) {
    setpresetStyle(newval);
  }

  function handleGeneratePress() {
    try {
      setIsGeneratingArt(true);
      callGetTextToArtPaymentTransaction();
    } catch (error: any) {
      setIsGeneratingArt(false);
    }
  }

  function hideImageViewer() {
    setShowImageModal(false);
  }

  async function callGetTextToArtPaymentTransaction() {
    //TODO: should be user friendly.. (disable generate btn if no connected wallet.)
    if (!publicKey) throw new Error("Wallet not connected");

    var signature = await sendGenerationTransaction();

    const posPrompt: Text_Prompt = {
      text: posInputRef.current.value,
      weight: 1,
    };

    const negPrompt: Text_Prompt = {
      text: negInputRef.current.value,
      weight: -1,
    };

    // Note wallet-adapter does not track network this so I'm going have to
    // use context for this(pretty sure one exists from the scaffold).
    // Granted, Devs can come in and manually
    // swap this to "Dev", "Test", Or "Live" - by default it should be "Live"
    const transactionRequest: TransactionDetail = {
      signature: signature,
      payerKey: publicKey.toString(),
      env: "Live",
    };

    const textToArtRequest: TextToArtTranscationRequest = {
      steps: +stepsRef.current.value,
      width: 1024,
      height: 1024,
      seed: 0,
      cfgScale: +cfgRef.current.value,
      stylePreset: presetStyleRef.current.value,
      textPrompts: [posPrompt, negPrompt],
      samples: 1,
      transactionRequest: transactionRequest,
    };

    // wait 20 sceconds. Otherwise backend RPC call may happen too fast...
    // obviously there is a better way to do this and sleeping
    // the client is a hack.. I just don't have time to fix
    // realistically I'll implement custom re-try/fault tolerance
    // in the backend httpclient
    await blockDelay(18000);

    if (signature !== null) {
      var result = await GenerateTextToArtResult(textToArtRequest);
      // console.log("Made the call successfully!:", result);

      RenderGeneratedArt(result);
      setIsGeneratingArt(false);
    }
  }

  async function sendGenerationTransaction() {
    let signature: TransactionSignature = "";
    try {
      const instructions = [
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            "9GXxoq5MFKe3Zwh36EKJrRNMCauf3j83iUWHp6qKc4HG"
          ),
          lamports: 4_530_000,
        }),
      ];

      let latestBlockhash = await connection.getLatestBlockhash();

      const messageLegacy = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToLegacyMessage();

      // TODO: Using Legacy for POC. Consider moving to Versioned

      const transation = new VersionedTransaction(messageLegacy);

      signature = await sendTransaction(transation, connection);

      // Await for confirmation
      const confRes = await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );

      console.log("confRes: ", confRes);

      notify({
        type: "success",
        message: "Transaction successful!",
        txid: signature,
      });

      if (signature === null) {
        setIsGeneratingArt(false);
        throw new Error("Signature was null after text to art transaction");
      }
      return signature;
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
        txid: signature,
      });
      setIsGeneratingArt(false);
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }

  function blockDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function RenderGeneratedArt(textToArtImages: TextToArtTranscationResponse) {
    //This does not account for the case of stablityTextToArtImages being
    //undefined. TODO: Better error handling around non 2xx
    if (!textToArtImages) {
      setIsGeneratingArt(false);
      notify({
        type: "error",
        message: `Art Generation Failed - Sorry :(`,
        description:
          "Please submit any useful info from the console github.com/jwbnw/ui-web3-ai",
      });
      return;
    }

    if (textToArtImages.stablityTextToArtImages[0].base64 !== null) {
      setImageModalDataRaw(textToArtImages.stablityTextToArtImages[0].base64);
      setShowImageModal(true);
    }
  }

  function ShouldGenerateArtBtnOrConnectWalletBtn() {
    if (!publicKey) {
      return (
        <WalletMultiButtonDynamic className="btn btn-wide">
          Connect Your Wallet To Get Started
        </WalletMultiButtonDynamic>
      );
    } else {
      return (
          <div>
          {!isGeneratingArt ? (
            <button
              className="btn btn-success btn-wide text-lg text-white"
              onClick={handleGeneratePress}
            >
              Generate!
            </button>
          ) : (
            <button disabled={true} className="btn btn-wide text-lg">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              Processing...
            </button>
          )}
        </div>
      );
    }
  }

  return (
    <div className="md:hero-content flex flex-col">
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
        AI Art Generation!
      </h1>
      <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
        {
          showImageModal ? (
            <TextToArtImageViewer
              hideModalFunc={hideImageViewer}
              imageDataRaw={imageModalDataRaw}
            />
          ) : (
            <div></div>
          )
          //  Then maybe one more "show my art btn here which flips
          //  showImageModal"
        }
        <main
          role="main"
          className="w-full h-full flex-grow p-3 overflow-auto "
        >
          <div className="flex flex-row">
            <div className="flex flex-col ">
              <h3>Pick Your Model</h3>
              <br />
              <br />
              <button
                type="button"
                className="btn text-white btn-neutral  text-sm px-5 py-2.5 text-center mr-2 mb-2"
                value="dalle"
                onClick={(e) => {
                  handleAiModelChage(e.currentTarget.value);
                }}
                disabled
              >
                DALL-E
              </button>
              <br />
              <br />
              <button
                type="button"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                value="stablity"
                onClick={(e) => {
                  handleAiModelChage(e.currentTarget.value);
                }}
              >
                Stablity AI
              </button>
              <br />
              <br />
              <button
                type="button"
                className="btn text-white btn-neutral font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                value="midjourney"
                onClick={(e) => {
                  handleAiModelChage(e.currentTarget.value);
                }}
                disabled
              >
                Mid-Journey
              </button>
            </div>
            <div className="pl-20 flex flex-col">
              <h3>Enter Your Prompts</h3>
              <br />
              <label className="block mb-2 text-sm font-medium text-green-900 dark:text-white">
                Positive Prompt
              </label>
              <textarea
                className="textarea textarea-accent"
                placeholder="cat and dog, happy, funny"
                ref={posInputRef}
              ></textarea>
              <br />
              <br />
              <label className="block mb-2 text-sm font-medium text-red-900 dark:text-white">
                Negative Prompt
              </label>
              <textarea
                className="textarea textarea-error"
                placeholder="blurry, bad"
                ref={negInputRef}
              ></textarea>
            </div>
            <div className="pl-20 flex flex-col">
              <h3>Tweek your settings</h3>
              <br />
              <label className="block mb-2 text-sm font-medium text-white dark:text-white">
                Style
              </label>
              <select
                value={presetStyle}
                onChange={(e) => {
                  handleStyleOption(e.currentTarget.value);
                }}
                className="select select-bordered w-full max-w-xs"
                ref={presetStyleRef}
              >
                <option disabled selected>
                  None
                </option>
                <option>Anime</option>
                <option>Enhance</option>
                <option>Neon Punk</option>
                <option>Cinematic</option>
                <option>3D Model</option>
              </select>
              <br />
              <label className="block mb-2 text-sm font-medium text-white dark:text-white">
                Steps {/*spec states 150 is max but anything above 40 returns a 400 serverside - invistigate later. */ }  
              </label>
              <input
                ref={stepsRef}
                type="range"
                min="10"
                max="40"
                defaultValue="30"
                className="range"
                step="10"
              />
              <div className="w-full flex justify-between text-xs px-2"> 
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
              </div>
              <br />
              <label className="block mb-2 text-sm font-medium text-white dark:text-white">
                CFG Scale
              </label>
              <input
                ref={cfgRef}
                type="text"
                placeholder="0-35"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
          </div>
          <div className="flex flex-row pt-10">
            <div className="basis-1/2">
              <PaymentPresenter />
            </div>
            <div className="basis-1/2 justify-center text-center py-8">
              <ShouldGenerateArtBtnOrConnectWalletBtn />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
