import { useWallet, useConnection} from "@solana/wallet-adapter-react";
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

export const AiArtComponent: React.FC = () => {

  const [modelValue, setModelValue] = useState("");
  const [presetStyle, setpresetStyle] = useState("None");
  const [costSol, setCostSol] = useState(0);
  const [costUsd, setCostUsd] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalDataRaw, setImageModalDataRaw] = useState("");

  const posInputRef = useRef(null);
  const negInputRef = useRef(null);
  const presetStyleRef = useRef(null);
  const cfgRef = useRef(null);
  const stepsRef = useRef(null);

  const { publicKey, sendTransaction,  } = useWallet();
  const { connection,  } = useConnection();

  function handleAiModelChage(newval: string) {
    setModelValue(newval); // make this value an enum
  }

  function handleStyleOption(newval: string) {
    setpresetStyle(newval);
  }

  function handleGeneratePress() {
    callGetTextToArtPaymentTransaction();
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

    // Note wallet-adapter does not track network this so I'm going have to build out 
    // some state management system for this. Granted, Devs can come in and manually 
    // swap this to "Dev", "Test", Or "Live" - by default it should be "Live"
    const transactionRequest: TransactionDetail = {
      signature: signature,
      payerKey: publicKey.toString(),
      env: "Live" 
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
    if (signature !== null) {
      var result = await GenerateTextToArtResult(textToArtRequest);
      console.log("Made the call successfully!:", result);

      RenderGeneratedArt(result);
    }
  }

  async function sendGenerationTransaction() {
    let signature: TransactionSignature = "";
    try {
      const instructions = [
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            process.env.NEXT_PUBLIC_DESTINATION_WALLET 
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

      // wait 17 sceconds. Otherwise backend RPC call can happens too fast...
      // obviously there is a better way to do this and sleeping
      // the client is a hack.. I just don't have time to fix
      // realistically I'll implement custom re-try/fault tolerance
      // in the backend httpclient
      await blockDelay(17000);

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

    if (textToArtImages.stablityTextToArtImages[0].base64 !== null) {
      setImageModalDataRaw(textToArtImages.stablityTextToArtImages[0].base64);
      setShowImageModal(true);
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
                placeholder="Harry Potter, Obama, Sonic, 10, Inu"
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
                Steps
              </label>
              <input
                ref={stepsRef}
                type="range"
                min="30"
                max="150"
                defaultValue="30"
                className="range"
                step="30"
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>30</span>
                <span>60</span>
                <span>90</span>
                <span>120</span>
                <span>150</span>
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
              <button
                className="btn btn-success btn-wide text-lg"
                onClick={handleGeneratePress}
              >
                Generate!
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
