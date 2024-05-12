"use client";

import React from "react";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-[#8A6697] bg-white text-center flex items-center justify-center px-4 py-2 text-xl rounded-xl"
    >
      {children}
    </button>
  );
};

export default Button;
