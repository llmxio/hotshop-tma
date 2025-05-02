import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaStop, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import {
  Button,
  Slider,
  Avatar,
  InlineButtons,
} from "@telegram-apps/telegram-ui";
import "./radio.css";

interface RadioPlayerProps {
  src?: string;
  title?: string;
  displayMode?: "inline" | "footer";
  artwork?: string;
}

export const RadioPlayer: React.FC<RadioPlayerProps> = ({
  src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  title = "Radio Stream",
  displayMode = "footer",
  artwork,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  // Add class to body when player is active
  useEffect(() => {
    document.body.classList.add("has-radio-player");
    return () => {
      document.body.classList.remove("has-radio-player");
    };
  }, []);

  const handlePlay = () => {
    audioRef.current?.play();
    setPlaying(true);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
  };

  const handleVolumeChange = (value: number) => {
    const v = value / 100;
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      if (v === 0) {
        setMuted(true);
      } else if (muted) {
        setMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !muted;
      audioRef.current.muted = newMuted;
      setMuted(newMuted);
    }
  };

  // Placeholder artwork URL if none provided
  const artworkUrl =
    artwork || `https://via.placeholder.com/48?text=${title.charAt(0)}`;

  const renderControls = () => (
    <>
      <audio ref={audioRef} src={src} preload="none" />
      <div className="radio-controls">
        <InlineButtons>
          <InlineButtons.Item disabled={playing} onClick={handlePlay}>
            <FaPlay />
          </InlineButtons.Item>

          <InlineButtons.Item disabled={!playing} onClick={handleStop}>
            <FaStop />
          </InlineButtons.Item>

          <InlineButtons.Item onClick={toggleMute}>
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </InlineButtons.Item>
        </InlineButtons>

        <div className="radio-volume">
          <Slider
            value={volume * 100}
            min={0}
            max={100}
            step={1}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </>
  );

  if (displayMode === "inline") {
    return (
      <div className="radio-panel" style={{ maxWidth: 320, padding: 16 }}>
        <div className="radio-info-inline">
          <Avatar size={40} src={artworkUrl} className="radio-artwork" />
          <div className="radio-title-inline">{title}</div>
        </div>
        {renderControls()}
      </div>
    );
  }

  return (
    <div className="radio-footer">
      <div className="radio-footer-content">
        <div className="radio-info">
          <Avatar size={40} src={artworkUrl} className="radio-artwork" />
          <div className="radio-title">
            {playing ? `Now playing: ${title}` : title}
          </div>
        </div>
        {renderControls()}
      </div>
    </div>
  );
};
