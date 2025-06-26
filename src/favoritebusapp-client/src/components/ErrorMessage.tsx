import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-900 to-pink-900">
    <div className="rounded-xl bg-white/10 px-8 py-6 shadow-xl backdrop-blur-md">
      <span className="block text-lg font-semibold text-white">
        Error: {message}
      </span>
    </div>
  </div>
);

export default ErrorMessage;
