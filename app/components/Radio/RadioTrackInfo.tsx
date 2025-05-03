import React, { useState, useEffect } from "react";
import { Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import {
  getArtistFromTitle,
  getSongFromTitle,
  getArtistImage,
} from "./RadioHelpers";

export interface RadioTrackInfoProps {
  name: string;
  index?: number;
  time?: string;
  defaultImage?: string;
}

export const RadioTrackInfo: React.FC<RadioTrackInfoProps> = ({
  name,
  index = 0,
  time,
  defaultImage = "https://avatars.githubusercontent.com/u/84640980?v=4",
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

  return (
    <Cell
      content={artist}
      subtitle={song}
      before={<Avatar size={48} src={artistImage} />}
      after={time ? <Info type="text" subtitle={time} /> : undefined}
    />
  );
};

export default RadioTrackInfo;
