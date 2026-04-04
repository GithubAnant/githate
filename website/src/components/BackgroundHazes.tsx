import React from "react";

export const BackgroundHazes = () => {
  return (
    <>
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[600px] bg-[#00b8d4]/25 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[600px] bg-[#ff7b00]/25 blur-[140px] rounded-full pointer-events-none z-0" />
    </>
  );
};
