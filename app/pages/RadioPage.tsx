import {
  RadioCurrentAlbum,
  RadioCurrentArtist,
  RadioCurrentStation,
} from "@/components/Radio";

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
