import React, { useEffect, useState } from "react";
import { Section, List, Cell, Image } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { CURRENT_ARTIST } from "./RadioCurrentArtist";

export interface Album {
  name: string;
  year: string;
  cover: string;
}

export let CURRENT_ALBUMS: Album[] = [
  // Default placeholder
  {
    name: "Unknown Album",
    year: "",
    cover: "https://ui-avatars.com/api/?name=Album",
  },
];

async function fetchAlbums(artist: string) {
  // Placeholder: In production, use a real API or web search
  // Here, just return some mock data
  if (!artist) return [];
  return [
    {
      name: "Greatest Hits",
      year: "",
      cover: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        artist
      )}+Album`,
    },
  ];
}

export function RadioCurrentAlbum() {
  const { playing } = useRadioPlayer();
  const [albums, setAlbums] = useState(CURRENT_ALBUMS);
  // Use name property which comes from our extended ArtistInfo interface
  const artist = CURRENT_ARTIST.name;

  useEffect(() => {
    if (artist) {
      fetchAlbums(artist).then((data) => {
        if (data && data.length > 0) {
          setAlbums(data);
          CURRENT_ALBUMS = data;
        }
      });
    }
  }, [artist]);

  if (!playing || !artist) return null;
  return (
    <Section header="Popular Albums">
      <List>
        {albums.map((album) => (
          <Cell
            key={album.name}
            subtitle={album.year ? `Year: ${album.year}` : undefined}
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
  );
}
