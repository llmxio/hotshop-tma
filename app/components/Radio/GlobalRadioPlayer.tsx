import React from "react";
import { Cell, Button, Avatar } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { Link } from "@/components/Link";
import { FaPlay, FaStop, FaMusic } from "react-icons/fa";

// Default station information for fallback
const defaultStation = {
  id: "balrockru",
  name: "Hot Shop",
  genre: "non-format music",
  src: "https://listen.myrh.ru/balrockru",
  artwork: "https://balrock.ru/images/icecastlogo.jpg",
};

interface GlobalRadioPlayerProps {
  mini?: boolean;
}

/**
 * A persistent radio player component that appears across all pages
 * Shows current song info and provides playback controls
 */
export const GlobalRadioPlayer: React.FC<GlobalRadioPlayerProps> = ({
  mini = false,
}) => {
  const { play, playing, currentStation, stop, currentSong } = useRadioPlayer();

  const stationName = currentStation.title || defaultStation.name;
  const stationSrc = currentStation.src || defaultStation.src;
  const stationArtwork = currentStation.artwork || defaultStation.artwork;

  const handlePlay = () => {
    play(stationSrc, stationName, stationArtwork);
  };

  const isStationPlaying = playing && currentStation.src === stationSrc;

  // Create track URL for navigation
  const trackUrl =
    isStationPlaying && currentSong.artist && currentSong.title
      ? `/track/${encodeURIComponent(currentSong.artist)}/${encodeURIComponent(
          currentSong.title
        )}`
      : null;

  // If not playing and in mini mode, show a more compact player
  if (mini && !isStationPlaying) {
    return (
      <Cell
        className="global-radio-player mini"
        before={<FaMusic />}
        after={
          <Button size="s" onClick={handlePlay} before={<FaPlay size={14} />}>
            Play Radio
          </Button>
        }
      >
        {stationName}
      </Cell>
    );
  }

  // Regular mode or playing in mini mode
  const cellContent = (
    <Cell
      className={`global-radio-player ${mini ? "mini" : ""}`}
      subtitle={
        isStationPlaying && currentSong.artist
          ? currentSong.artist
          : defaultStation.genre
      }
      before={
        <Avatar
          size={mini ? 40 : 48}
          src={stationArtwork}
          style={{ borderRadius: 4 }}
        />
      }
      after={
        <Button
          size="s"
          onClick={(e) => {
            e.stopPropagation();
            isStationPlaying ? stop() : handlePlay();
          }}
          before={
            isStationPlaying ? <FaStop size={14} /> : <FaPlay size={14} />
          }
        >
          {isStationPlaying ? "Stop" : "Play"}
        </Button>
      }
    >
      {isStationPlaying && currentSong.title ? currentSong.title : stationName}
    </Cell>
  );

  // If we have track info and it's playing, make the cell a link to the track page
  return trackUrl &&
    isStationPlaying &&
    currentSong.artist &&
    currentSong.title ? (
    <Link to={trackUrl}>{cellContent}</Link>
  ) : (
    cellContent
  );
};

export default GlobalRadioPlayer;
