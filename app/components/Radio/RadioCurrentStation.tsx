import React from "react";
import { Section, Cell, Image, Button } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";

// Default station information for fallback
const defaultStation = {
  id: "balrockru",
  name: "Hot Shop",
  genre: "non-format music",
  src: "https://listen.myrh.ru/balrockru",
  artwork: "https://balrock.ru/images/icecastlogo.jpg",
};

export const RadioCurrentStation: React.FC = () => {
  const { play, playing, currentStation, stop, currentSong } = useRadioPlayer();

  const stationName = currentStation.title || defaultStation.name;
  const stationSrc = currentStation.src || defaultStation.src;
  const stationArtwork = currentStation.artwork || defaultStation.artwork;

  const handlePlay = () => {
    play(stationSrc, stationName, stationArtwork);
  };

  const isStationPlaying = playing && currentStation.src === stationSrc;

  return (
    <Section
      header={<Section.Header large>{stationName}</Section.Header>}
      // footer={
      //   <Section.Footer>{defaultStation.genre} streaming 24/7</Section.Footer>
      // }
    >
      <Cell
        subtitle={
          isStationPlaying && currentSong.artist
            ? currentSong.title
            : defaultStation.genre
        }
        before={
          <Image
            src={stationArtwork}
            style={{ width: 60, height: 60, borderRadius: 4 }}
          />
        }
        after={
          isStationPlaying ? (
            <Button size="s" onClick={stop}>
              Stop
            </Button>
          ) : (
            <Button size="s" onClick={handlePlay}>
              Play
            </Button>
          )
        }
      >
        {isStationPlaying && currentSong.artist
          ? currentSong.artist
          : stationName}
      </Cell>
    </Section>
  );
};
