import { useEffect, useState } from "react";
import {
  Section,
  Cell,
  Avatar,
  Info,
  Spinner,
} from "@telegram-apps/telegram-ui";
import { radioHeartService } from "@/services/RadioHeartService";
import { musicBrainzService } from "@/services/MusicBrainzService";
import { useParams } from "react-router";

// Define param types for useParams
type TrackInfoParams = {
  trackArtist?: string;
  trackTitle?: string;
};

export function TrackInfo() {
  const { trackArtist, trackTitle } = useParams<TrackInfoParams>();

  if (!trackArtist || !trackTitle) {
    return (
      <Section header="Track Info">
        <Cell>Track information not found</Cell>
      </Section>
    );
  }

  return (
    <TrackInfoComponent trackArtist={trackArtist} trackTitle={trackTitle} />
  );
}

export function TrackInfoComponent({
  trackArtist,
  trackTitle,
}: {
  trackArtist: string;
  trackTitle: string;
}) {
  const [artistImage, setArtistImage] = useState<string>(
    "https://billing.radioheart.ru/public_pages/assets/img/noimage.jpg"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trackDetails, setTrackDetails] = useState<{
    album?: string;
    year?: string;
    genre?: string;
    bio?: string;
  }>({});

  // Decode URI components
  const artist = trackArtist ? decodeURIComponent(trackArtist) : "";
  const title = trackTitle ? decodeURIComponent(trackTitle) : "";

  // Fetch artist image and additional details when component mounts
  useEffect(() => {
    if (artist && title) {
      setLoading(true);

      const fetchMusicBrainzData = async () => {
        try {
          // Use the comprehensive method to get all information in one call
          const {
            artist: artistInfo,
            albums,
            track: trackInfo,
          } = await musicBrainzService.getFullTrackInfo(artist, title);

          // Find the first album with year information
          const firstAlbum = albums && albums.length > 0 ? albums[0] : null;

          // Update track details with the fetched info
          setTrackDetails({
            album: firstAlbum?.name || "Unknown Album",
            year: firstAlbum?.year || "",
            genre: artistInfo?.country || "", // Use country as genre if no genres available
            bio: artistInfo?.bio || `${artist} is a music artist.`,
          });

          console.log("Music data loaded:", {
            artist: artistInfo,
            albums,
            track: trackInfo,
          });
        } catch (error) {
          console.error("Error fetching music data:", error);
          setError("Failed to load track information");
        } finally {
          setLoading(false);
        }
      };

      // Start data fetching
      fetchMusicBrainzData();

      // Get the artist image using RadioHeartService
      radioHeartService.getArtistImage(
        artist,
        title,
        artistImage,
        (imageUrl) => {
          setArtistImage(imageUrl);
        }
      );
    }
  }, [artist, title]);

  if (!artist || !title) {
    return <Section header="Track Info">Track not found</Section>;
  }

  if (loading) {
    return (
      <Section header="Track Info">
        <Cell>
          <Spinner size="m" />
        </Cell>
      </Section>
    );
  }

  if (error) {
    return (
      <Section header="Track Info">
        <Cell>{error}</Cell>
      </Section>
    );
  }

  return (
    <>
      <Section header="Track Info">
        <Cell subtitle={artist} before={<Avatar size={48} src={artistImage} />}>
          {title}
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

export default TrackInfo;
