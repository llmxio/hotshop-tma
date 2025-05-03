import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

interface RadioPlayerProps {
  playing: boolean;
  currentStation: {
    src: string;
    title: string;
    artwork?: string;
  };
  volume: number;
  muted: boolean;
  currentSong: {
    artist: string;
    title: string;
    fullTitle: string;
  };
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

export const RadioPlayer = createContext<RadioPlayerProps>(defaultContext);

export const useRadioPlayer = () => useContext(RadioPlayer);

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
  const [currentSong, setCurrentSong] = useState<{
    artist: string;
    title: string;
    fullTitle: string;
  }>({
    artist: "",
    title: "",
    fullTitle: "",
  });

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

  // Helper to parse URL
  function getLocation(href: string) {
    const match = href.match(
      /^(https?:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
    );
    return (
      match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7],
      }
    );
  }

  // Helper functions to extract artist and title from song title
  function getArtistFromTitle(trackTitle: string): string {
    if (!trackTitle) return "";

    let split = trackTitle.split(" | ");

    if (split.length > 0) {
      return split[1].split("-")[0].trim();
    }

    return trackTitle;
  }

  function getSongFromTitle(trackTitle: string): string {
    if (!trackTitle) return "";
    let split = trackTitle.split(" | ");

    if (split.length > 0) {
      return split[1].split("-")[1].trim();
    }

    return "";
  }

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

            console.log("Current song:", { artist, title, fullTitle });

            setCurrentSong({
              artist,
              title,
              fullTitle,
            });

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
  }, [currentStation.src]);

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

  return <RadioPlayer.Provider value={value}>{children}</RadioPlayer.Provider>;
};
