import { useRef, useState } from "react";
import { THRERSHOLD } from "@constants/swiper";

export const useSwiper = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleEnd = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;

    setIsDragging(false);

    const diffX = clientX - startX;

    if (diffX < -THRERSHOLD) {
      containerRef.current.scrollBy({
        left: containerRef.current.offsetWidth,
        behavior: "smooth",
      });
    } else if (diffX > THRERSHOLD) {
      containerRef.current.scrollBy({
        left: -containerRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return {
    containerRef,
    isDragging,
    handleStart,
    handleEnd,
    setIsDragging,
  };
};
