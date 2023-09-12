import React from "react";
import Link from "next/link";

const TopLevelNav = () => {
  return (
    <nav className="border-gray-200 background-start-rgb: 214, 219, 220 background-end-rgb: 255, 255, 255">
        <div className="flex items-center justify-between mx-auto p-4">
                <div className="h-8 mr-3">
                    <Link href="/">Home</Link>
                </div>
        </div>
    </nav>
  );
};
export default TopLevelNav;