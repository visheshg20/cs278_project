import { useEffect, useState } from "react";

import { SECONDS_PER_DAY, padZero } from "@/utils";

export default function useCountdownTimer(countdownTo: string) {
  const [countdownTimer, setCountdownTimer] = useState("");
  useEffect(() => {
    let timeDelta = Math.floor(
      (Date.parse(countdownTo) - new Date().getTime()) / 1000
    );
    if (timeDelta >= 0) {
      const interval = setInterval(() => {
        let timeDiff = Math.floor(
          (Date.parse(countdownTo) - new Date().getTime()) / 1000
        );
        if (timeDiff < 0) {
          setCountdownTimer("");
        } else {
          const diffSeconds = Math.floor(timeDiff) % 60;
          const diffMinutes = Math.floor(timeDiff / 60) % 60;
          const diffHours = Math.floor(timeDiff / 3600);
          const timeDiffString = `${padZero(diffHours)}:${padZero(
            diffMinutes
          )}:${padZero(diffSeconds)}`;
          setCountdownTimer(timeDiffString);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else if (timeDelta < 0) setCountdownTimer("");
  }, [countdownTo]);

  return countdownTimer;
}
