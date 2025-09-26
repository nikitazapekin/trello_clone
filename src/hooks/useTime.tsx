import { useEffect, useRef, useState } from "react";
import { days, MILLISECONDS_IN_MINUTE, months, SECONDS_IN_MINUTE } from "@constants";
import type { TimeAndDate } from "@types/timeAndDateTypes";
import { getCurrentTime } from "@utils/helpers/getCurrentTime/getCurrentTime";

const useTime = () => {
  const [timeData, setTimeData] = useState<TimeAndDate>(getCurrentTime());
  const initialTime = useRef<number>(Date.now());
  const nextUpdate = useRef<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();

      const adjustedTime = new Date(initialTime.current + (now - initialTime.current));
      const timeString = adjustedTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const dayName = days[adjustedTime.getDay()];
      const day = adjustedTime.getDate();
      const month = months[adjustedTime.getMonth()];
      const year = adjustedTime.getFullYear();

      const dateString = `${dayName}, ${day} ${month} ${year}`;

      setTimeData({ timeString, dateString });

      const currentSeconds = adjustedTime.getSeconds();
      const delay = (SECONDS_IN_MINUTE - currentSeconds) * MILLISECONDS_IN_MINUTE;

      nextUpdate.current = window.setTimeout(updateTime, delay);
    };

    updateTime();

    return () => {
      if (nextUpdate.current) {
        clearTimeout(nextUpdate.current);
      }
    };
  }, []);

  return timeData;
};

export default useTime;
