import React from "react";
import { Page } from "~/components/Page";
import { RadioCurrentStation } from "../components/Radio/RadioCurrentStation";
import { RadioCurrentArtist } from "../components/Radio/RadioCurrentArtist";
import { RadioCurrentAlbum } from "../components/Radio/RadioCurrentAlbum";

export function RadioPage() {
  return (
    <Page back={false}>
      <RadioCurrentStation />
      <RadioCurrentArtist />
      <RadioCurrentAlbum />
      {/* The RadioGlobalFooter will appear automatically when the station is playing */}
    </Page>
  );
}
