import React, { useEffect, useState } from "react";
import {
  Section,
  List,
  Button,
  Spinner,
  Divider,
} from "@telegram-apps/telegram-ui";
import { RadioTrackInfo } from "./RadioTrackInfo";
import { radioHeartService } from "@/services/RadioHeartService";
import type { Track } from "@/services/RadioHeartService";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";

interface RadioPlaylistProps {
  initialTracks?: Track[];
}

export const RadioPlaylist: React.FC<RadioPlaylistProps> = ({
  initialTracks = [],
}) => {
  const { playing } = useRadioPlayer();

  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [loading, setLoading] = useState(initialTracks.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentTracks = async () => {
    try {
      setLoading(true);
      const recentTracks = await radioHeartService.getRecentTracks(20);
      setTracks(recentTracks);
    } catch (err) {
      console.error("Error fetching track history:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load track history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTracks.length > 0) {
      return; // Skip fetching if we have initial tracks
    }

    fetchRecentTracks();
  }, [initialTracks]);

  if (loading) {
    return (
      <Section header="Recently Played Tracks">
        <Spinner size="m" />
      </Section>
    );
  }

  if (error) {
    return (
      <Section header="Recently Played Tracks">
        <div className="error-state">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      {tracks.length === 0 ? (
        <div className="empty-state">No recent tracks found</div>
      ) : (
        <List>
          {tracks.map((track, index) => (
            <>
              <RadioTrackInfo
                key={index}
                name={track.name}
                index={0}
                time={track.time}
              />
              <Divider />
            </>
          ))}
        </List>
      )}
    </Section>
  );
};

export default RadioPlaylist;
