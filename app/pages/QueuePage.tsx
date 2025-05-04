import { RadioTrackHistory } from "@/components/Radio";
import { RadioCurrentStation } from "@/components/Radio/RadioCurrentStation";

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
