import React from "react";
import { Cell, Button, Avatar, Divider } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { Link } from "@/components/Link";
import { Icon24Play, Icon24Stop, Icon24Music } from "@vkontakte/icons";
import { publicUrl } from "@/utils/public-url";

// Default station information for fallback
const defaultStation = {
  id: "balrockru",
  name: "Hot Shop",
  genre: "non-format music",
  src: "https://listen.myrh.ru/balrockru",
  artwork: "/logobot.png",
};

interface RadioPlayerProps {
  mini?: boolean;
}

/**
 * A persistent radio player component that appears across all pages
 * Shows current song info and provides playback controls
 */
export const RadioPlayer: React.FC<RadioPlayerProps> = ({ mini = false }) => {
  const { play, playing, currentStation, stop, currentSong } = useRadioPlayer();

  const stationName = currentStation.title || defaultStation.name;
  const stationSrc = currentStation.src || defaultStation.src;
  const stationArtwork = currentStation.artwork || defaultStation.artwork;

  const isStationPlaying = playing && currentStation.src === stationSrc;

  // Use track artwork when available, fall back to station artwork
  const displayArtwork =
    isStationPlaying && currentSong.artwork
      ? currentSong.artwork
      : stationArtwork;

  const handlePlay = () => {
    play(stationSrc, stationName, stationArtwork);
  };

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
        className="radio-player mini"
        before={<Icon24Music />}
        after={
          <Button size="s" onClick={handlePlay} before={<Icon24Play />}>
            Play Radio
          </Button>
        }
      >
        {stationName}
      </Cell>
    );
  }

  // Regular mode or playing in mini mode
  return (
    <Cell
      className={`radio-player ${mini ? "mini" : ""}`}
      subtitle={
        isStationPlaying && currentSong.artist
          ? currentSong.artist
          : defaultStation.genre
      }
      before={
        <Avatar
          size={mini ? 40 : 48}
          src={displayArtwork}
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
            isStationPlaying ? (
              <Icon24Stop />
            ) : (
              <Icon24Play width={14} height={14} />
            )
          }
        >
          {isStationPlaying ? "Stop" : "Play"}
        </Button>
      }
    >
      {isStationPlaying && currentSong.title && trackUrl ? (
        <>
          <Link to={trackUrl}>{currentSong.title}</Link>
        </>
      ) : (
        stationName
      )}
    </Cell>
  );
};

export default RadioPlayer;
