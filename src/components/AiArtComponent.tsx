import Link from "next/link";
import { FC, useState } from "react";

export const AiArtComponent: React.FC = () => {
  const [stepsValue, setStepsValue] = useState("");

  function stepsOnChange(newval: any) {
    console.log(newval);
    setStepsValue(newval);
  }

  return (
    <div className="md:hero-content flex flex-col">
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
        AI Art Generation!
      </h1>
      <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
        <main
          role="main"
          className="w-full h-full flex flex-row flex-grow p-3 overflow-auto "
        >
          <div className="flex flex-col ">
            <h3>Pick Your Model</h3>
            <br />
            <br />
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              DALL-E
            </button>
            <br />
            <br />
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Stablity AI
            </button>
            <br />
            <br />
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
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
            ></textarea>
            <br />
            <br />
            <label className="block mb-2 text-sm font-medium text-red-900 dark:text-white">
              Negative Prompt
            </label>
            <textarea
              className="textarea textarea-error"
              placeholder="blurry, bad"
            ></textarea>
          </div>
          <div className="pl-20 flex flex-col">
            <h3>Tweek your settings</h3>
            <br />
            <label className="block mb-2 text-sm font-medium text-white dark:text-white">
              Style
            </label>
            <select className="select select-bordered w-full max-w-xs">
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
              type="range"
              min="30"
              max="150"
              defaultValue="0"
              className="range"
              step="30"
              onChange={(e) => {
                stepsOnChange(e.currentTarget.value);
              }}
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
              type="text"
              placeholder="0-35"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </main>
      </div>
    </div>
  );
};
