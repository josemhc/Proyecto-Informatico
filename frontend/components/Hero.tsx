import React from "react";
import { WavyBackgroundDemo } from "./WavyBackground";

export const Hero = () => {
  
  return (
    <div className="pb-20 pt-36">
      <div className="h-screen w-full dark:bg-black-100 bg-white flex items-center justify-center absolute top-0 left-0 ">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <WavyBackgroundDemo />
      </div>
    </div>
  );
};