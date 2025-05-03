import React from "react";
import { Section, Cell, Image, Button } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "./RadioPlayerContext";

export let CURRENT_STATION = {
  id: "balrockru",
  name: "Balrock Radio",
  genre: "Rock & Metal musicss",
  src: "https://listen.myrh.ru/balrockru",
  artwork: "https://i.imgur.com/jcGpRrV.jpg",
};

export function RadioCurrentStation() {
  const { play, playing, currentStation, stop } = useRadioPlayer();
  // Update global CURRENT_STATION with live data
  CURRENT_STATION = {
    ...CURRENT_STATION,
    name: currentStation.title || CURRENT_STATION.name,
    src: currentStation.src || CURRENT_STATION.src,
    artwork: currentStation.artwork || CURRENT_STATION.artwork,
  };
  const handlePlay = () => {
    play(CURRENT_STATION.src, CURRENT_STATION.name, CURRENT_STATION.artwork);
  };
  const isStationPlaying =
    playing && currentStation.src === CURRENT_STATION.src;
  return (
    <Section
      header={<Section.Header large>{CURRENT_STATION.name}</Section.Header>}
      footer={
        <Section.Footer>{CURRENT_STATION.genre} streaming 24/7</Section.Footer>
      }
    >
      <Cell
        subtitle={CURRENT_STATION.genre}
        before={
          <Image
            src={CURRENT_STATION.artwork}
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
        {CURRENT_STATION.name}
      </Cell>
    </Section>
  );
}
