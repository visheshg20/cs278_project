import { cn } from "@/utils";
import React from "react";

interface GenerateBioButtonProps {
  onClick: () => void;
}

const GenerateBioButton: React.FC<GenerateBioButtonProps> = ({ onClick }) => {
  const [hasBeenClicked, setHasBeenClicked] = React.useState(false);

  return (
    <button
      className={cn(
        !hasBeenClicked ? "bg-purple-500" : "bg-gray-400",
        "text-base py-2 px-4 pr-3 w-fit rounded-md self-end mt-5 flex items-center gap-2"
      )}
      disabled={hasBeenClicked}
      onClick={() => {
        setHasBeenClicked(true);
        onClick();
      }}
    >
      Make it for me!
    </button>
  );
};

export default GenerateBioButton;
