import { Link } from "@/components/Link";
import { Avatar, Cell, Info } from "@telegram-apps/telegram-ui";
import React, { useEffect, useState } from "react";

import {
  getArtistFromTitle,
  getSongFromTitle,
  radioHeartService,
} from "@/services/RadioHeartService";
import { DEFAULT_ARTWORK } from "@/types/appTypes";

// Helper function to format time as HH:MM
const formatTime = (timeString?: string) => {
  if (!timeString) return "";
  return new Date(timeString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export interface RadioTrackInfoProps {
  name: string;
  index?: number;
  time?: string;
  defaultImage?: string;
  dense?: boolean;
}

export const RadioTrackInfo: React.FC<RadioTrackInfoProps> = ({
  name,
  index = 0,
  time,
  defaultImage = DEFAULT_ARTWORK,
  dense = false,
}) => {
  const artist = getArtistFromTitle(name);
  const title = getSongFromTitle(name);
  const [artistImage, setArtistImage] = useState<string>(defaultImage);

  // Fetch artist image when track name changes
  useEffect(() => {
    if (name) {
      radioHeartService.getArtistImage(
        artist,
        title,
        defaultImage,
        (imageUrl) => {
          setArtistImage(imageUrl);
        }
      );
    }
  }, [name, defaultImage]);

  // Create track URL with encoded parameters
  const trackUrl = `/track/${encodeURIComponent(artist)}/${encodeURIComponent(
    title
  )}`;

  const cellContent = dense ? (
    <Cell
      before={
        <Avatar size={40} src={artistImage} style={{ borderRadius: 4 }} />
      }
      after={time}
    >
      {`${artist} - ${title}`}
    </Cell>
  ) : (
    <Cell
      subtitle={artist}
      before={
        <Avatar size={48} src={artistImage} style={{ borderRadius: 4 }} />
      }
      after={time ? <Info type="text" subtitle={time} /> : undefined}
    >
      {title}
    </Cell>
  );

  return <Link to={trackUrl}>{cellContent}</Link>;
};

export default RadioTrackInfo;
