import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useRef, useState } from "react";
import { PaymentPresenter } from "./PaymentPresenter";
import { TextToArtRequest, Text_Prompt } from "models/TextToArtRequest";
import {
  GenerateStablityTextToArt,
  GenerateTextToArtTransaction,
} from "../services/TextToArtService";
import GenerateTextToArtTransactionRequest from "models/GenerateTextToArtTransactionRequest";

export const AiArtComponent: React.FC = () => {
  //TODO:
  // 1) create state to hold user values - Done
  // 2) on generate click create object to send to backend to be proxied - Done
  // 3) on generate send a transaction of estimated ammounnt to new wallet
  // 4) if success then proxy call to backend, if faliure alert and log.

  // Dev Thoughts.. Refs should be used to create DTO for backend
  // State should be used if needed to retain values.
  const [modelValue, setModelValue] = useState("");
  const [presetStyle, setpresetStyle] = useState("None");
  const [costSol, setCostSol] = useState(0);
  const [costUsd, setCostUsd] = useState(0);

  const posInputRef = useRef(null);
  const negInputRef = useRef(null);
  const presetStyleRef = useRef(null);
  const cfgRef = useRef(null);
  const stepsRef = useRef(null);

  const { publicKey, signMessage } = useWallet();

  function handleAiModelChage(newval: string) {
    setModelValue(newval); // make this value an enum
  }

  function handleStyleOption(newval: string) {
    setpresetStyle(newval);
  }

  function handleGeneratePress() {
    callGetTextToArtPaymentTransaction();
  }

  async function callGetTextToArtPaymentTransaction() {
    //TODO: should be user firendly.. (disable generate btn if no connected wallet.)
    if (!publicKey) throw new Error("Wallet not connected");

    const posPrompt: Text_Prompt = {
      text: posInputRef.current.value,
      weight: 1,
    };

    const negPrompt: Text_Prompt = {
      text: negInputRef.current.value,
      weight: -1,
    };

    const transactionRequest: GenerateTextToArtTransactionRequest = {
      estimatedCostUsd: null,
      estimatedCostSol: costSol,
      paymentChoice: "SOL",
      payerKey: publicKey.toString(),
    };

    const textToArtRequest: TextToArtRequest = {
      steps: +stepsRef.current.value,
      width: 1024,
      height: 1024,
      seed: 0,
      cfg_scale: +cfgRef.current.value,
      style_preset: presetStyleRef.current.value, // note if this is none I need to removeit from ther request
      text_prompts: [posPrompt, negPrompt],
      samples: 1,
      transaction_request: transactionRequest,
    };

    var transaction = await GenerateTextToArtTransaction(textToArtRequest);
  }

  return (
    <div className="md:hero-content flex flex-col">
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
        AI Art Generation!
      </h1>
      <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
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
