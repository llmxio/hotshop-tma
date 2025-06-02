import { RadioPlaylist } from "@/components/Radio";

interface RadioProps {
  recentTracks?: any[];
}

export function Radio({ recentTracks }: RadioProps) {
  return <RadioPlaylist initialTracks={recentTracks} />;
}
