import { RadioCurrentStation } from "../components/Radio/RadioCurrentStation";
import { RadioCurrentArtist } from "../components/Radio/RadioCurrentArtist";
import { RadioCurrentAlbum } from "../components/Radio/RadioCurrentAlbum";
import { RadioTrackHistory } from "../components/Radio/RadioTrackHistory";
import { RadioTrackQueue } from "../components/Radio/RadioTrackQueue";
import { RadioListenerCount } from "../components/Radio/RadioListenerCount";
import { Section } from "@telegram-apps/telegram-ui";

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
