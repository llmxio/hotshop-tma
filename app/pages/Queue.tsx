import { RadioTrackHistory } from "@/components/Radio";
import { RadioCurrentStation } from "@/components/Radio/RadioCurrentStation";

interface QueueProps {
  recentTracks?: any[];
}

export function Queue({ recentTracks }: QueueProps) {
  return (
    <>
      <RadioCurrentStation />
      <RadioTrackHistory initialTracks={recentTracks} />
    </>
  );
}
