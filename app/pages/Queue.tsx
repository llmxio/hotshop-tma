import React, { useState, useEffect } from "react";
import { RadioTrackHistory } from "@/components/Radio";
import { GlobalRadioPlayer } from "@/components/Radio";

interface QueueProps {
  recentTracks?: any[];
}

export function Queue({ recentTracks }: QueueProps) {
  const [isScrolling, setIsScrolling] = useState(false);

  // Set up scroll listener to detect when user is scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Only show minimized player when user has scrolled down a bit
      const shouldShowFixed = scrollPosition > 50;
      setIsScrolling(shouldShowFixed);

      // Toggle class on app container for proper spacing
      const appContainer = document.querySelector(".app-container");
      if (appContainer) {
        if (shouldShowFixed) {
          appContainer.classList.add("fixed-player-active");
        } else {
          appContainer.classList.remove("fixed-player-active");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);

      // Clean up class when unmounting
      const appContainer = document.querySelector(".app-container");
      if (appContainer) {
        appContainer.classList.remove("fixed-player-active");
      }
    };
  }, []);

  return (
    <>
      {isScrolling && (
        <div className="fixed-player">
          <GlobalRadioPlayer mini />
        </div>
      )}
      <RadioTrackHistory initialTracks={recentTracks} />
    </>
  );
}
