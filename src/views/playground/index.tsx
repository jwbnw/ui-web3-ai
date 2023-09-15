import { FC } from "react";
import { UserDetails } from "../../components/UserDetails";
import Link from "next/link";
import { useState } from "react";
import { PlaygoundSideBar } from "components/PlaygroundSideBar";
import { AiArtComponent } from "components/AiArtComponent";
import { AiTextComponent } from "components/AiTextComponent";

export const PlaygroundView: FC = ({}) => {
  const renderArt = true;

  return (
    <div className="w-screen">
      <div className="flex-row lg:flex">
        <PlaygoundSideBar/>
        <div className="container mx-auto mt-4 lg:mt-12 p-4 shadow-sm">
          {/*This down can also go in the seperate playgound components*/}
            <div className="md:hero mx-auto p-4">
              { renderArt ? < AiArtComponent /> : < AiTextComponent /> }
            </div>
        </div>
    </div>
    </div>
  );
};
