import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Section, Cell, Avatar, Info } from "@telegram-apps/telegram-ui";
import { radioHeartService } from "../services/RadioHeartService";

// Define param types as a Record type for useParams
type TrackInfoParams = {
  trackArtist: string;
  trackName: string;
};

export function TrackInfoPage({ trackArtist, trackName }: TrackInfoParams) {
  // const { trackArtist, trackName } = useParams<TrackInfoParams>();

  const [artistImage, setArtistImage] = useState<string>(
    "https://billing.radioheart.ru/public_pages/assets/img/noimage.jpg"
  );

  const [trackDetails, setTrackDetails] = useState<{
    album?: string;
    year?: string;
    genre?: string;
    bio?: string;
  }>({});

  // Decode URI components
  const artist = trackArtist ? decodeURIComponent(trackArtist) : "";
  const title = trackName ? decodeURIComponent(trackName) : "";

  // Fetch artist image and additional details when component mounts
  useEffect(() => {
    if (artist && title) {
      radioHeartService.getArtistImage(
        artist,
        title,
        artistImage,
        (imageUrl) => {
          setArtistImage(imageUrl);
        }
      );

      // Mock fetch additional details (in a real app, you would call an API)
      // This would be replaced with actual API calls in production
      setTrackDetails({
        album: "Unknown Album",
        year: "2024",
        genre: "Pop",
        bio: `${artist} is a music artist known for their unique style and sound.`,
      });
    }
  }, [artist, title]);

  if (!artist || !title) {
    return <Section header="Track Info">Track not found</Section>;
  }

  return (
    <>
      <Section header="Track Info">
        <Cell subtitle={title} before={<Avatar size={48} src={artistImage} />}>
          {artist}
        </Cell>

        {trackDetails.album && (
          <Cell subtitle="Album">{trackDetails.album}</Cell>
        )}

        {trackDetails.year && (
          <Cell subtitle="Released">{trackDetails.year}</Cell>
        )}

        {trackDetails.genre && (
          <Cell subtitle="Genre">{trackDetails.genre}</Cell>
        )}
      </Section>

      {trackDetails.bio && (
        <Section header="About Artist">
          <Cell multiline>{trackDetails.bio}</Cell>
        </Section>
      )}
    </>
  );
}

export default TrackInfoPage;
