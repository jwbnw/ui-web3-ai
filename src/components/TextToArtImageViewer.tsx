import Link from "next/link";
import { FC, useEffect, useState } from "react";

//Incoming props should be image.
type TextToArtImageViewerProps = {
  hideModalFunc: Function;
  imageDataRaw: string;
};

export const TextToArtImageViewer: React.FC<TextToArtImageViewerProps> = ({
  hideModalFunc,
  imageDataRaw,
}) => {
  return (
    <div className="fixed top-0 left-0 z-80 w-screen h-screen bg-black/70 flex justify-center items-center">
      <img
        src={`data:image/png;base64,${imageDataRaw}`}
        //src="https://thegreatroom.co/wp-content/uploads/2019/12/1024.png" //testing placeholder
        className="h-96"
      ></img>
      <div className="absolute bottom-0 h-60">
        {" "}
        {/*h-60 is a hack - nest img in dev and pad top relative*/}
        <button
          className=" btn btn-square btn-outline"
          onClick={() => hideModalFunc()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
