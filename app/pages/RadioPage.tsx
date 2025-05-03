import { Page } from "~/components/Page";
import { RadioCurrentStation } from "../components/RadioCurrentStation";
import { RadioCurrentArtist } from "../components/RadioCurrentArtist";
import { RadioCurrentAlbum } from "../components/RadioCurrentAlbum";

export function RadioPage() {
  return (
    <Page back={false}>
      <RadioCurrentStation />
      <RadioCurrentArtist />
      <RadioCurrentAlbum />
      {/* The GlobalRadioFooter will appear automatically when the station is playing */}
    </Page>
  );
}
