import React from "react";
import { FaPlay, FaStop, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useRadioPlayer } from "./RadioPlayerContext";
import { Slider, Avatar, InlineButtons } from "@telegram-apps/telegram-ui";
import "./radio.css";

export const GlobalRadioFooter: React.FC = () => {
  const {
    playing,
    currentStation,
    volume,
    muted,
    play,
    stop,
    setVolume,
    toggleMute,
  } = useRadioPlayer();

  // Don't render anything if there's no current station
  if (!currentStation.src) {
    return null;
  }

  const handleSliderChange = (value: number) => {
    setVolume(value / 100);
  };

  // Placeholder artwork URL - in a real app you'd fetch this dynamically
  const artworkUrl =
    currentStation.artwork ||
    `https://via.placeholder.com/48?text=${currentStation.title?.charAt(0)}`;

  return (
    <div className="radio-footer">
      <div className="radio-footer-content">
        <div className="radio-info">
          <Avatar size={40} src={artworkUrl} className="radio-artwork" />
          <div className="radio-title">
            {playing
              ? `Now playing: ${currentStation.title}`
              : currentStation.title}
          </div>
        </div>

        <div className="radio-controls">
          <InlineButtons>
            <InlineButtons.Item disabled={playing} onClick={() => play()}>
              <FaPlay />
            </InlineButtons.Item>

            <InlineButtons.Item disabled={!playing} onClick={stop}>
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
              onChange={handleSliderChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
