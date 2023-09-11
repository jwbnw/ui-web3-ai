import React from "react";
import Link from "next/link";

const TopLevelNav = () => {
  return (
    <nav className="border-gray-200 background-start-rgb: 214, 219, 220 background-end-rgb: 255, 255, 255">
        <div className="ax-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="h-8 mr-3">
                    <Link href="/">Home</Link>
                </div>
                <div className="flex md:order-2">
                    <button className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">Connect Wallet Stub</button>
                </div>
        </div>
    </nav>
  );
};
export default TopLevelNav;