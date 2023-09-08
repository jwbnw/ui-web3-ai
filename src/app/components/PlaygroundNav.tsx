import React from "react";
import Link from "next/link";

const PlaygoundNav = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <ul className="menu menu-vertical px-1 btn btn-ghost normal-case text-xl">
          <li>
            <Link href="/playground/art-generator">Art Generator</Link>
          </li>
          <li>
            <Link href="/playground/text-generator">Text Generator</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default PlaygoundNav;