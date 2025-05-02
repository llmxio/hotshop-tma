import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

interface RadioPlayerContextProps {
  playing: boolean;
  currentStation: {
    src: string;
    title: string;
    artwork?: string;
  };
  volume: number;
  muted: boolean;
  play: (src?: string, title?: string, artwork?: string) => void;
  stop: () => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
}

const defaultContext: RadioPlayerContextProps = {
  playing: false,
  currentStation: {
    src: "",
    title: "",
  },
  volume: 1,
  muted: false,
  play: () => {},
  stop: () => {},
  setVolume: () => {},
  toggleMute: () => {},
};

export const RadioPlayerContext =
  createContext<RadioPlayerContextProps>(defaultContext);

export const useRadioPlayer = () => useContext(RadioPlayerContext);

export const RadioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState({
    src: "",
    title: "",
    artwork: "",
  });
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);

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

  const value: RadioPlayerContextProps = {
    playing,
    currentStation,
    volume,
    muted,
    play,
    stop,
    setVolume,
    toggleMute,
  };

  return (
    <RadioPlayerContext.Provider value={value}>
      {children}
    </RadioPlayerContext.Provider>
  );
};
