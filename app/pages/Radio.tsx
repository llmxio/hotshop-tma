import { RadioCurrentAlbum, RadioCurrentArtist } from "@/components/Radio";
import { RadioListenerCount } from "@/components/Radio/RadioListenerCount";
import type { Track } from "@/services/RadioHeartService";
import { Section, Placeholder, Button } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";

interface RadioProps {
  recentTracks?: Track[];
}

// The Radio page displays the Radio content since navigation is handled globally
export function Radio({ recentTracks = [] }: RadioProps) {
  const { playing, play } = useRadioPlayer();

  const handlePlay = () => {
    play();
  };

  if (!playing) {
    return (
      <Placeholder
        header="Start Listening"
        description={
          <>
            <p>Start listening to get crypto</p>
            <Button size="l" onClick={handlePlay}>
              Play Radio
            </Button>
          </>
        }
      />
    );
  }

  // Create radio content without RadioCurrentStation (now handled by GlobalRadioPlayer)
  return (
    <>
      <RadioCurrentArtist />
      <RadioCurrentAlbum />
      {/* <Section header="Station Info">
        <RadioListenerCount />
      </Section> */}
    </>
  );
}
