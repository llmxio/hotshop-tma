import { useEffect, useState } from "react";
import {
  Section,
  Cell,
  Avatar,
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

// Default placeholder image for artists
const DEFAULT_ARTIST_IMAGE = "https://billing.radioheart.ru/public_pages/assets/img/noimage.jpg";

// Track details type definition
interface TrackDetails {
  album?: string;
  year?: string;
  genre?: string;
  bio?: string;
}

// Loading state component
const LoadingState = () => (
  <Section header="Track Info">
    <Cell>
      <Spinner size="m" />
    </Cell>
  </Section>
);

// Error state component
const ErrorState = ({ message }: { message: string }) => (
  <Section header="Track Info">
    <Cell>{message}</Cell>
  </Section>
);

// Track not found component
const NotFoundState = () => (
  <Section header="Track Info">
    <Cell>Track information not found</Cell>
  </Section>
);

// Main track info display component
const TrackInfoDisplay = ({
  artist,
  title,
  artistImage,
  trackDetails
}: {
  artist: string;
  title: string;
  artistImage: string;
  trackDetails: TrackDetails;
}) => (
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

// Custom hook for fetching track data
function useTrackData(artist: string, title: string) {
  const [artistImage, setArtistImage] = useState<string>(DEFAULT_ARTIST_IMAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackDetails, setTrackDetails] = useState<TrackDetails>({});

  useEffect(() => {
    if (!artist || !title) return;

    setLoading(true);
    setError(null);

    const fetchMusicBrainzData = async () => {
      try {
        const {
          artist: artistInfo,
          albums,
          track: trackInfo,
        } = await musicBrainzService.getFullTrackInfo(artist, title);

        const firstAlbum = albums && albums.length > 0 ? albums[0] : null;

        setTrackDetails({
          album: firstAlbum?.name || "Unknown Album",
          year: firstAlbum?.year || "",
          genre: artistInfo?.country || "",
          bio: artistInfo?.bio || `${artist} is a music artist.`,
        });
      } catch (err) {
        console.error("Error fetching music data:", err);
        setError("Failed to load track information");
      } finally {
        setLoading(false);
      }
    };

    // Fetch artist image
    radioHeartService.getArtistImage(
      artist,
      title,
      DEFAULT_ARTIST_IMAGE,
      setArtistImage
    );

    // Fetch track data
    fetchMusicBrainzData();
  }, [artist, title]);

  return { artistImage, loading, error, trackDetails };
}

export function TrackInfo() {
  const { trackArtist, trackTitle } = useParams<TrackInfoParams>();

  if (!trackArtist || !trackTitle) {
    return <NotFoundState />;
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
  // Decode URI components
  const artist = decodeURIComponent(trackArtist);
  const title = decodeURIComponent(trackTitle);

  // Use custom hook to fetch data
  const { artistImage, loading, error, trackDetails } = useTrackData(artist, title);

  // Handle various states
  if (!artist || !title) {
    return <NotFoundState />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <TrackInfoDisplay
      artist={artist}
      title={title}
      artistImage={artistImage}
      trackDetails={trackDetails}
    />
  );
}

export default TrackInfo;
