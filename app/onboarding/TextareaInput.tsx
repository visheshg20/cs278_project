import { cn } from "@/utils";
import React, { useEffect, useState } from "react";

interface TextareaInputProps {
  value?: string;
  setValue?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  value,
  setValue,
  onKeyDown,
}) => {
  const [internalValue, setInternalValue] = useState("");

  const textRef = React.useRef<HTMLTextAreaElement>(null);

  function adjustHeight() {
    if (!textRef.current) return;
    textRef.current.style.height = "inherit";
    textRef.current.style.height = `${textRef.current?.scrollHeight}px`;
  }

  useEffect(() => {
    adjustHeight();
  }, [value, internalValue]);

  return (
    <textarea
      ref={textRef}
      value={value ? value : internalValue}
      placeholder="Your fun bio here!"
      onChange={(e) => {
        setValue ? setValue(e) : setInternalValue(e.target.value);
      }}
      onKeyDown={onKeyDown}
      className={cn(
        "resize-none max-h-32 h-10 bg-transparent border-b-[1.5px] border-white !text-base px-3 py-2 outline-none transition-all focus:bg-[rgba(255,255,255,0.2)] focus:border-b-[3px]"
      )}
    />
  );
};

export default TextareaInput;
