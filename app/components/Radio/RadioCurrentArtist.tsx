import React, { useEffect, useState } from "react";
import { Section, Cell, Avatar } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "./RadioPlayer";

export let CURRENT_ARTIST = {
  name: "",
  song: "",
  album: "",
  year: "",
  artwork: "",
  bio: "",
};

async function fetchArtistInfo(artist: string, song: string) {
  // Placeholder: In production, use a real API or web search
  // Here, just return some mock data
  return {
    album: "Unknown Album",
    year: "",
    artwork: `https://ui-avatars.com/api/?name=${encodeURIComponent(artist)}`,
    bio: `No bio found for ${artist}.`,
  };
}

export function RadioCurrentArtist() {
  const { playing, currentStation, currentSong } = useRadioPlayer();
  const [artistInfo, setArtistInfo] = useState({
    album: "",
    year: "",
    artwork: "",
    bio: "",
  });

  // Use artist and title directly from the currentSong object
  const { artist, title } = currentSong;

  useEffect(() => {
    if (artist) {
      fetchArtistInfo(artist, title).then(setArtistInfo);
    }
  }, [artist, title]);

  // Update global CURRENT_ARTIST
  CURRENT_ARTIST = {
    name: artist,
    song: title,
    album: artistInfo.album,
    year: artistInfo.year,
    artwork: artistInfo.artwork,
    bio: artistInfo.bio,
  };

  if (!playing || !artist) return null;
  return (
    <Section header="Now Playing">
      <Cell
        subtitle={
          artistInfo.album
            ? `${artistInfo.album}${
                artistInfo.year ? ` (${artistInfo.year})` : ""
              }`
            : undefined
        }
        before={
          <Avatar
            size={48}
            src={artistInfo.artwork}
            style={{ borderRadius: 4 }}
          />
        }
      >
        {artist} {title && `- ${title}`}
      </Cell>
      {artistInfo.bio && <Cell multiline>{artistInfo.bio}</Cell>}
    </Section>
  );
}
