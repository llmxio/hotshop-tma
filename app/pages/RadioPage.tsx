import {
  Avatar,
  Button,
  Cell,
  Image,
  List,
  Section,
} from "@telegram-apps/telegram-ui";
import { Page } from "~/components/Page";
import { useRadioPlayer } from "~/components/RadioPlayerContext";

// Only keep Balrock Radio
const BALROCK_STATION = {
  id: "balrockru",
  name: "Balrock Radio",
  genre: "Rock & Metal music",
  src: "https://listen.myrh.ru/balrockru",
  artwork: "https://i.imgur.com/jcGpRrV.jpg", // Example album art
};

// Sample artist information (placeholder data)
const CURRENT_ARTIST = {
  name: "Metallica",
  song: "Enter Sandman",
  album: "Metallica (Black Album)",
  year: "1991",
  artwork: "https://i.imgur.com/A1BVXiM.jpg",
  bio: "Metallica is an American heavy metal band formed in 1981. The band was founded when vocalist/guitarist James Hetfield responded to an advertisement by drummer Lars Ulrich in a local newspaper.",
};

// Sample albums (placeholder data)
const ARTIST_ALBUMS = [
  {
    name: "Master of Puppets",
    year: "1986",
    cover: "https://i.imgur.com/LZxWGKz.jpg",
  },
  {
    name: "Ride the Lightning",
    year: "1984",
    cover: "https://i.imgur.com/DqsTRQV.jpg",
  },
  {
    name: "...And Justice for All",
    year: "1988",
    cover: "https://i.imgur.com/TyHZzB5.jpg",
  },
];

export function RadioPage() {
  const { play, playing, currentStation, stop } = useRadioPlayer();

  // Handle station play
  const handlePlay = () => {
    play(BALROCK_STATION.src, BALROCK_STATION.name, BALROCK_STATION.artwork);
  };

  // Check if Balrock station is playing
  const isStationPlaying = () => {
    return playing && currentStation.src === BALROCK_STATION.src;
  };

  return (
    <Page back={false}>
      <Section
        header="Balrock Radio"
        footer="Rock & Metal music streaming 24/7"
      >
        <Cell
          subtitle={BALROCK_STATION.genre}
          before={
            <Image
              src={BALROCK_STATION.artwork}
              style={{ width: 60, height: 60, borderRadius: 4 }}
            />
          }
          after={
            isStationPlaying() ? (
              <Button size="m" onClick={stop}>
                Stop
              </Button>
            ) : (
              <Button size="m" onClick={handlePlay}>
                Play
              </Button>
            )
          }
        >
          {BALROCK_STATION.name}
        </Cell>
      </Section>

      {isStationPlaying() && (
        <>
          <Section header="Now Playing">
            <Cell
              subtitle={`${CURRENT_ARTIST.album} (${CURRENT_ARTIST.year})`}
              before={
                <Avatar
                  size={48}
                  src={CURRENT_ARTIST.artwork}
                  style={{ borderRadius: 4 }}
                />
              }
            >
              {CURRENT_ARTIST.name} - {CURRENT_ARTIST.song}
            </Cell>
            <Cell multiline>{CURRENT_ARTIST.bio}</Cell>
          </Section>

          <Section header="Popular Albums">
            <List>
              {ARTIST_ALBUMS.map((album) => (
                <Cell
                  key={album.name}
                  subtitle={`Year: ${album.year}`}
                  before={
                    <Image
                      src={album.cover}
                      style={{ width: 48, height: 48, borderRadius: 4 }}
                    />
                  }
                >
                  {album.name}
                </Cell>
              ))}
            </List>
          </Section>
        </>
      )}

      {/* The GlobalRadioFooter will appear automatically when the station is playing */}
    </Page>
  );
}
