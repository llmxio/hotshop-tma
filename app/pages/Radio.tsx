import { RadioCurrentArtist } from "@/components/Radio/RadioCurrentArtist";
import { RadioCurrentAlbum } from "@/components/Radio/RadioCurrentAlbum";
import { RadioCurrentStation } from "@/components/Radio/RadioCurrentStation";

export function Radio() {
  return (
    <>
      <RadioCurrentStation />
      <RadioCurrentArtist />
      <RadioCurrentAlbum />
      {/* <Section header="Station Info">
        <RadioListenerCount />
      </Section> */}
      {/* <RadioTrackQueue /> */}
      {/* <RadioTrackHistory /> */}
      {/* The RadioGlobalFooter will appear automatically when the station is playing */}
    </>
  );
}
