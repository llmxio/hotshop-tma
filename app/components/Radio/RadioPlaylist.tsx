import React, { useEffect, useState } from "react";
import { Section, List, Button, Spinner } from "@telegram-apps/telegram-ui";
import { RadioTrackInfo } from "./RadioTrackInfo";
import { radioHeartService } from "@/services/RadioHeartService";
import type { Track } from "@/services/RadioHeartService";

interface RadioPlaylistProps {
  initialTracks?: Track[];
}

export const RadioPlaylist: React.FC<RadioPlaylistProps> = ({
  initialTracks = [],
}) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [loading, setLoading] = useState(initialTracks.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTracks.length > 0) {
      return; // Skip fetching if we have initial tracks
    }

    const fetchRecentTracks = async () => {
      try {
        setLoading(true);
        const upcomingTracks = await radioHeartService.getUpcomingTracks(1);
        const recentTracks = await radioHeartService.getRecentTracks(9);
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
    <Section header="Recently Played Tracks">
      {tracks.length === 0 ? (
        <div className="empty-state">No recent tracks found</div>
      ) : (
        <List>
          {tracks.map((track, index) => (
            <RadioTrackInfo
              key={index}
              name={track.name}
              index={index}
              time={track.time}
            />
          ))}
        </List>
      )}
    </Section>
  );
};

export default RadioPlaylist;
