import React from "react";
import { Card, Button, Image } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { Icon24Play, Icon24Stop } from "@vkontakte/icons";
import { DEFAULT_STATION } from "@/types/appTypes";
import "./RadioController.css";

/**
 * A floating radio controller component that appears in the bottom right corner of all pages
 * Shows current song artwork when playing and provides playback controls
 */
export const RadioController: React.FC = () => {
  const { play, playing, currentStation, stop, currentSong } = useRadioPlayer();

  const stationName = currentStation.title || DEFAULT_STATION.title;
  const stationSrc = currentStation.src || DEFAULT_STATION.src;
  const stationArtwork = currentStation.artwork || DEFAULT_STATION.artwork;

  const isStationPlaying = playing && currentStation.src === stationSrc;

  // Use track artwork when available, fall back to station artwork
  const displayArtwork =
    isStationPlaying && currentSong.artwork
      ? currentSong.artwork
      : stationArtwork;

  const handlePlay = () => {
    play(stationSrc, stationName, stationArtwork);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  return (
    <div className="radio-controller-container">
      <div
        className={`radio-controller-card ${isStationPlaying ? "playing" : ""}`}
        onClick={!isStationPlaying ? handlePlay : undefined}
      >
        {/* Using a styled div instead of Card component to avoid styling issues */}
        <div className="custom-card">
          {/* Card content with artwork when playing */}
          {isStationPlaying ? (
            <>
              <div className="radio-controller-artwork">
                <Image
                  src={displayArtwork}
                  alt={currentSong.fullTitle || stationName}
                />
                <div className="radio-controller-overlay">
                  <Button
                    size="l"
                    className="radio-controller-stop-button"
                    onClick={handleStop}
                    before={<Icon24Stop />}
                  >
                    Stop
                  </Button>
                </div>
              </div>
              <div className="radio-controller-info">
                <div className="radio-controller-title">
                  {currentSong.title || stationName}
                </div>
                {currentSong.artist && (
                  <div className="radio-controller-artist">
                    {currentSong.artist}
                  </div>
                )}
              </div>
            </>
          ) : (
            // Play button when not playing
            <div className="radio-controller-play">
              <Icon24Play width={24} height={24} />
              <div className="radio-controller-play-text">Play Radio</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
