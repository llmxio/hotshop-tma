import React from "react";
import { RadioCurrentStation } from "~/components/Radio/RadioCurrentStation";
import { RadioTrackHistory } from "~/components/Radio/RadioTrackHistory";

interface QueuePageProps {
  recentTracks?: any[];
}

export function QueuePage({ recentTracks }: QueuePageProps) {
  return (
    <>
      <RadioCurrentStation />
      <RadioTrackHistory initialTracks={recentTracks} />
    </>
  );
}
