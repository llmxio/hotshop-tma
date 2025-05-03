import React, { useEffect, useState } from "react";
import { Section, Cell, Avatar } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "./RadioPlayerContext";

export let CURRENT_ARTIST = {
  name: "",
  song: "",
  album: "",
  year: "",
  artwork: "",
  bio: "",
};

function parseArtistSong(title: string) {
  if (!title) return { artist: "", song: "" };
  let split = title.split(" - ");
  if (split.length > 1)
    return { artist: split[0].trim(), song: split[1].trim() };
  split = title.split("–");
  if (split.length > 1)
    return { artist: split[0].trim(), song: split[1].trim() };
  return { artist: title, song: "" };
}

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
  const { artist, song } = parseArtistSong(currentSong);

  useEffect(() => {
    if (artist) {
      fetchArtistInfo(artist, song).then(setArtistInfo);
    }
  }, [artist, song]);

  // Update global CURRENT_ARTIST
  CURRENT_ARTIST = {
    name: artist,
    song,
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
        {artist} {song && `- ${song}`}
      </Cell>
      {artistInfo.bio && <Cell multiline>{artistInfo.bio}</Cell>}
    </Section>
  );
}
