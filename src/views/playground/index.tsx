
import { FC } from "react";
import { UserDetails } from "../../components/UserDetails";

export const PlaygroundView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Playground
        </h1>
        <div>
             {/* Left Vertical Nav Here I suppose then we'll have the diffrent playground componenets dynmaically render */}
        </div>
      </div>
    </div>
  );
};
