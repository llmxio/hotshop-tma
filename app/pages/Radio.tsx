import React from "react";
import { RadioCurrentArtist, RadioCurrentAlbum } from "@/components/Radio";
import { RadioTrackHistory } from "@/components/Radio";
import type { Track } from "@/services/RadioHeartService";
import { RadioListenerCount } from "@/components/Radio/RadioListenerCount";
import { Section } from "@telegram-apps/telegram-ui";

interface RadioProps {
  recentTracks?: Track[];
}

// The Radio page displays the Radio content since navigation is handled globally
export function Radio({ recentTracks = [] }: RadioProps) {
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
