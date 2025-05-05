import React from "react";
import { RadioCurrentStation } from "@/components/Radio/RadioCurrentStation";
import { Switcher } from "@/components/Switcher";
import { RadioCurrentAlbum } from "@/components/Radio/RadioCurrentAlbum";
import { RadioCurrentArtist } from "@/components/Radio/RadioCurrentArtist";
import { RadioTrackHistory } from "@/components/Radio";
import type { Track } from "@/services/RadioHeartService";
import { FaMusic, FaList } from "react-icons/fa";

interface IndexProps {
  recentTracks?: Track[];
}

export function Index({ recentTracks = [] }: IndexProps) {
  // Create radio content and queue content outside of JSX for readability
  const radioContent = (
    <>
      <RadioCurrentStation />
      <RadioCurrentArtist />
      <RadioCurrentAlbum />
    </>
  );

  const queueContent = (
    <>
      <RadioCurrentStation />
      <RadioTrackHistory initialTracks={recentTracks} />
    </>
  );

  return (
    <Switcher defaultActiveTab={0} className="app-main-tabbar">
      <Switcher.Item title="Radio" icon={<FaMusic />}>
        {radioContent}
      </Switcher.Item>
      <Switcher.Item title="Queue" icon={<FaList />}>
        {queueContent}
      </Switcher.Item>
    </Switcher>
  );
}
