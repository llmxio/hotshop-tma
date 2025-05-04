import { RadioCurrentStation, RadioTrackHistory } from "@/components/Radio";

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
