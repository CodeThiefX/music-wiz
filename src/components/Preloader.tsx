import React from "react";

const Preloader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  );
};

export default Preloader;
