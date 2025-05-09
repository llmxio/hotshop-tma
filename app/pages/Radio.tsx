import { RadioCurrentAlbum, RadioCurrentArtist } from "@/components/Radio";
import type { Track } from "@/services/RadioHeartService";
import { Section, Placeholder, Button } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { bem } from "@/css/bem";
import { DEFAULT_STATION } from "@/types/appTypes";
import "./Radio.css";

const [, e] = bem("radio-page");

interface RadioProps {
  recentTracks?: Track[];
}

// The Radio page displays the Radio content since navigation is handled globally
export function Radio({ recentTracks = [] }: RadioProps) {
  const { playing, play } = useRadioPlayer();

  const handlePlay = () => {
    // Pass the required parameters to the play function
    play(DEFAULT_STATION.src, DEFAULT_STATION.title, DEFAULT_STATION.artwork);
  };

  if (!playing) {
    return (
      <Placeholder
        className={e("placeholder")}
        header="Start Listening"
        description={
          <>
            <p>and earn coins</p>
            <Button size="s" onClick={handlePlay}>
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
      {/* Removed unused RadioListenerCount section */}
    </>
  );
}
