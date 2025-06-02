// src/hooks/useSwipe.ts
import { useEffect, useRef } from "react";

interface SwipeOptions {
  threshold?: number; // Minimum distance (px) to consider a swipe
  allowedAxis?: "horizontal" | "vertical"; // Restrict swipe detection to one axis
}

type SwipeCallback = (direction: "left" | "right") => void;

export const useSwipe = (
  onLeftSwipe: SwipeCallback,
  onRightSwipe: SwipeCallback,
  options: SwipeOptions = {}
) => {
  const { threshold = 50, allowedAxis = "horizontal" } = options;
  const startXRef = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (allowedAxis === "horizontal") {
        startXRef.current = e.touches[0].clientX;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (startXRef.current === null) return;

      const endX = e.changedTouches[0].clientX;
      const diff = startXRef.current - endX;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          onLeftSwipe("left");
        } else {
          onRightSwipe("right");
        }
      }

      startXRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onLeftSwipe, onRightSwipe, threshold, allowedAxis]);
};
