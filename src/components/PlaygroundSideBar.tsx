import Link from 'next/link';
import { FC, useState } from 'react';


export const PlaygoundSideBar: React.FC<any> = (props) => {
    const [open, setOpen] = useState(false);
    
    {/*Couple these at somepoint*/}
    const AiArtNameConst = "AiArtComponent";
    const AiTextNameConst = "AiTextComponent";

    return (
        <div
          className={` ${
            open ? "lg:w-6" : "lg:w-60 "
          }left-0 flex flex-col p-3 w-full bg-indigo opacity-50 shadow duration-300`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button onClick={() => setOpen(!open)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1">
              <ul className="pt-2 pb-4 space-y-1 text-sm">
                <li className="rounded-sm">
                  <button
                    onClick={() => props.sendAiComponentData(AiArtNameConst)}
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <span className="text-gray-100">AI Art Generator</span>
                  </button>
                </li>
                <li className="rounded-sm">
                  <button
                    onClick={() => props.sendAiComponentData(AiTextNameConst)}
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <span className="text-gray-100">AI Text Generator</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
    )
}