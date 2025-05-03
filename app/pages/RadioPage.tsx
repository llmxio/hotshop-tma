import { RadioCurrentStation } from "../components/Radio/RadioCurrentStation";
import { RadioCurrentArtist } from "../components/Radio/RadioCurrentArtist";
import { RadioCurrentAlbum } from "../components/Radio/RadioCurrentAlbum";
import { RadioTrackHistory } from "../components/Radio/RadioTrackHistory";
// import { RadioTrackQueue } from "../components/Radio/RadioTrackQueue";

export function RadioPage() {
  return (
    <>
      <RadioCurrentStation />
      {/* <RadioCurrentArtist /> */}
      {/* <RadioCurrentAlbum /> */}
      <RadioTrackHistory />
      {/* <RadioTrackQueue /> */}
      {/* The RadioGlobalFooter will appear automatically when the station is playing */}
    </>
  );
}
