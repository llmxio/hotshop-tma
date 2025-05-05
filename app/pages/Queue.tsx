import React from "react";
import { RadioTrackHistory } from "@/components/Radio";

interface QueueProps {
  recentTracks?: any[];
}

export function Queue({ recentTracks }: QueueProps) {
  return (
    <>
      <RadioTrackHistory initialTracks={recentTracks} />
    </>
  );
}
