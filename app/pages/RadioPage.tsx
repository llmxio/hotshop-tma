import React from "react";
import { RadioCurrentStation } from "../components/Radio/RadioCurrentStation";
import { RadioCurrentArtist } from "../components/Radio/RadioCurrentArtist";
import { RadioCurrentAlbum } from "../components/Radio/RadioCurrentAlbum";

export function RadioPage() {
  return (
    <>
      <RadioCurrentStation />
      <RadioCurrentArtist />
      <RadioCurrentAlbum />
      {/* The RadioGlobalFooter will appear automatically when the station is playing */}
    </>
  );
}
