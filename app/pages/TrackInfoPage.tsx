import { useEffect, useState } from "react";
import { Section, Cell, Avatar, Info } from "@telegram-apps/telegram-ui";
import { radioHeartService } from "@/services/RadioHeartService";
import { musicBrainzService } from "@/services/MusicBrainzService";

// Define param types as a Record type for useParams
type TrackInfoParams = {
  trackArtist: string;
  trackTitle: string;
};

export function TrackInfoPage({ trackArtist, trackTitle }: TrackInfoParams) {
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
  const title = trackTitle ? decodeURIComponent(trackTitle) : "";

  // Fetch artist image and additional details when component mounts
  useEffect(() => {
    if (artist && title) {
      // Set up loading state
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
  }, [artist, title, artistImage]);

  if (!artist || !title) {
    return <Section header="Track Info">Track not found</Section>;
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

export default TrackInfoPage;
