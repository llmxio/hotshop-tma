import React from "react";
import { RadioCurrentArtist, RadioCurrentAlbum } from "@/components/Radio";
import { RadioTrackHistory } from "@/components/Radio";
import type { Track } from "@/services/RadioHeartService";
import { RadioListenerCount } from "@/components/Radio/RadioListenerCount";
import { Section } from "@telegram-apps/telegram-ui";

interface IndexProps {
  recentTracks?: Track[];
}

// The Index page now just displays the Radio content since navigation is handled globally
export function Index({ recentTracks = [] }: IndexProps) {
  // Create radio content without RadioCurrentStation (now handled by GlobalRadioPlayer)
  return (
    <>
      <RadioCurrentArtist />
      <RadioCurrentAlbum />
      <Section header="Station Info">
        <RadioListenerCount />
      </Section>
    </>
  );
}
