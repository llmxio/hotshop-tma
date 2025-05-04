import { RadioCurrentAlbum, RadioCurrentArtist } from "@/components/Radio";
import { RadioCurrentStation } from "@/components/Radio/RadioCurrentStation";

export function RadioPage() {
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
