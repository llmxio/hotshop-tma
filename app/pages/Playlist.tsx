import { RadioPlaylist } from "@/components/Radio";

interface PlaylistProps {
  recentTracks?: any[];
}

export function Playlist({ recentTracks }: PlaylistProps) {
  return <RadioPlaylist initialTracks={recentTracks} />;
}
