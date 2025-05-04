import React, { useState, useEffect } from "react";
import { Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import {
  getArtistFromTitle,
  getSongFromTitle,
  getArtistImage,
} from "./RadioHelpers";
import { Link } from "~/components/Link/Link";

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
  defaultImage = "https://billing.radioheart.ru/public_pages/assets/img/noimage.jpg",
  dense = false,
}) => {
  const artist = getArtistFromTitle(name);
  const song = getSongFromTitle(name);
  const [artistImage, setArtistImage] = useState<string>(defaultImage);

  // Fetch artist image when track name changes
  useEffect(() => {
    if (name) {
      getArtistImage(name, defaultImage, (imageUrl) => {
        setArtistImage(imageUrl);
      });
    }
  }, [name, defaultImage]);

  // Create track URL with encoded parameters
  const trackUrl = `/track/${encodeURIComponent(artist)}/${encodeURIComponent(
    song
  )}`;

  const cellContent = dense ? (
    <Cell before={<Avatar size={40} src={artistImage} />} after={time}>
      {`${artist} - ${song}`}
    </Cell>
  ) : (
    <Cell
      subtitle={song}
      before={<Avatar size={48} src={artistImage} />}
      after={time ? <Info type="text">{time}</Info> : undefined}
    >
      {artist}
    </Cell>
  );

  return <Link to={trackUrl}>{cellContent}</Link>;
};

export default RadioTrackInfo;
