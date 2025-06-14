import React, { createContext, useRef, useState, useEffect } from "react";

import {
  getLocation,
  getArtistFromTitle,
  getSongFromTitle,
  radioHeartService,
} from "@/services/RadioHeartService";
import type { RadioStation, RadioSong } from "@/types/appTypes";
import { DEFAULT_ARTWORK } from "@/types/appTypes";

export interface RadioPlayerProps {
  playing: boolean;
  currentStation: RadioStation;
  volume: number;
  muted: boolean;
  currentSong: RadioSong;
  play: (src?: string, title?: string, artwork?: string) => void;
  stop: () => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  getCurrentSongTitle?: () => void;
}

const defaultContext: RadioPlayerProps = {
  playing: false,
  currentStation: {
    src: "",
    title: "",
  },
  volume: 1,
  muted: false,
  currentSong: {
    artist: "",
    title: "",
    fullTitle: "",
  },
  play: () => {},
  stop: () => {},
  setVolume: () => {},
  toggleMute: () => {},
};

export const RadioPlayerContext = createContext(defaultContext);

export const RadioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<RadioStation>({
    src: "",
    title: "",
    artwork: "",
  });
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentSong, setCurrentSong] = useState<RadioSong>({
    artist: "",
    title: "",
    fullTitle: "",
    artwork: "",
  });

  // Fetch artwork for the current track
  const fetchTrackArtwork = (artist: string, title: string) => {
    if (!artist || !title) return;

    radioHeartService.getArtistImage(
      artist,
      title,
      currentStation.artwork || DEFAULT_ARTWORK,
      (imageUrl: string) => {
        setCurrentSong((prev) => ({ ...prev, artwork: imageUrl }));
      }
    );
  };

  useEffect(() => {
    // Create audio element when component mounts
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    return () => {
      // Clean up when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  // Fetch current song and update context
  const getCurrentSongTitle = React.useCallback(() => {
    if (!currentStation.src) return;
    const stream = currentStation.src;
    const globalMount = undefined; // Set if needed
    let streamPath = getLocation(stream);
    let jsonPath;
    if (streamPath && streamPath.host === "listen.myrh.ru") {
      jsonPath = stream + "/json.xsl";
    } else if (streamPath) {
      jsonPath = streamPath.protocol + "//" + streamPath.host + "/json.xsl";
    } else {
      return;
    }
    let radioMounts = ["/studio", "/relay", "/nonstop"];
    fetch(jsonPath)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((response: any) => {
        let mounts = response.mounts;
        let directMount = mounts.find(
          (item: any) => !radioMounts.includes(item.mount)
        );
        if (directMount) {
          radioMounts.unshift(directMount.mount);
        }
        if (globalMount) {
          radioMounts.unshift(globalMount);
        }
        for (let i = 0; i < radioMounts.length; i++) {
          let radioMount = radioMounts[i];
          let icecastMount = mounts.find(
            (item: any) => item.mount === radioMount && item.title.length > 0
          );
          if (icecastMount) {
            const fullTitle = icecastMount.title;
            const artist = getArtistFromTitle(fullTitle);
            const title = getSongFromTitle(fullTitle);

            // Check if the song changed before fetching new artwork
            if (artist !== currentSong.artist || title !== currentSong.title) {
              console.log("Current song:", fullTitle);

              setCurrentSong({
                artist,
                title,
                fullTitle,
                artwork:
                  currentSong.artwork ||
                  currentStation.artwork ||
                  DEFAULT_ARTWORK,
              });

              // Fetch track artwork when we have a new song
              fetchTrackArtwork(artist, title);
            }

            setCurrentStation((prev) => ({
              ...prev,
              title: icecastMount.name || prev.title,
            }));
            break;
          }
        }
      })
      .catch((err) => {
        // Optionally handle error
        console.error("Failed to fetch current song:", err);
      });
  }, [
    currentStation.src,
    currentSong.artist,
    currentSong.title,
    currentStation.artwork,
  ]);

  // Poll for song updates when playing
  useEffect(() => {
    let interval: number | undefined;

    if (playing) {
      getCurrentSongTitle();
      interval = window.setInterval(getCurrentSongTitle, 5000);
    }

    return () => {
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [playing, getCurrentSongTitle]);

  const play = (src?: string, title?: string, artwork?: string) => {
    if (!audioRef.current) return;

    // If a new source is provided, update it
    if (src && src !== currentStation.src) {
      audioRef.current.src = src;
      setCurrentStation({
        src,
        title: title || "Radio Stream",
        artwork: artwork || "",
      });

      // Reset current song when changing stations
      setCurrentSong({
        artist: "",
        title: "",
        fullTitle: "",
        artwork: artwork || "",
      });
    }

    // If we don't have a source yet, don't try to play
    if (!audioRef.current.src && !src) return;

    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch((error) => {
        console.error("Error playing audio:", error);
        setPlaying(false);
      });
  };

  const stop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  };

  const setVolume = (value: number) => {
    if (!audioRef.current) return;

    setVolumeState(value);
    audioRef.current.volume = value;

    // Update muted state based on volume
    if (value === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    const newMuted = !muted;
    audioRef.current.muted = newMuted;
    setMuted(newMuted);
  };

  const value: RadioPlayerProps = {
    playing,
    currentStation,
    volume,
    muted,
    currentSong,
    play,
    stop,
    setVolume,
    toggleMute,
    getCurrentSongTitle,
  };

  return (
    <RadioPlayerContext.Provider value={value}>
      {children}
    </RadioPlayerContext.Provider>
  );
};
