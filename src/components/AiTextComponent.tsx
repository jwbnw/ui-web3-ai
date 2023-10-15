import Link from 'next/link';
import { FC, useState } from 'react';


export const AiTextComponent: React.FC = () => {
    return (
        <div className="md:hero-content flex flex-col">
                <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
                  AI Text Generation!
                </h1>
                <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
                  <main
                    role="main"
                    className="w-full h-full flex-grow p-3 overflow-auto text-center"
                  >
                    {/*main here*/} Coming Soon!
                  </main>
                </div>
              </div>
    )
}