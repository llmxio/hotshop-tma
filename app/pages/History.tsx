import React from "react";
import { RadioPlaylist } from "@/components/Radio";

interface HistoryProps {
  recentTracks?: any[];
}

export function History({ recentTracks }: HistoryProps) {
  return (
    <>
      <RadioPlaylist initialTracks={recentTracks} />
    </>
  );
}
