import React from "react";

const Loading: React.FC = () => (
  <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-900 to-blue-900">
    <div className="rounded-xl bg-white/10 px-8 py-6 shadow-xl backdrop-blur-md">
      <span className="block animate-pulse text-lg font-semibold text-white">
        Loading...
      </span>
    </div>
  </div>
);

export default Loading;
